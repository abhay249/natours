const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/apperror");
const sendMail = require("./../utils/email");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  // Remove the password
  user.password = undefined;
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    token,
    status: "Success",
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role,
  });
  createSendToken(newUser, 201, res);
  // const token = signToken(newUser._id);
  // res.status(201).json({
  //   status: "Success",
  //   token,
  //   data: {
  //     user: newUser,
  //     message: "done",
  //   },
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1)Check email or password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  // 2)check user exist or password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // const user = await User.find({ email }).select("+password");
  // const correct = await user.correctPassword(password, user.password);

  // if (!user || !correct) {
  //   return next(new AppError("Invalid email or password", 401));
  // }
  // console.log(user);
  // 3)If everything ok send it to client
  createSendToken(user, 200, res);
  // const token = signToken(user._id);

  // res.status(200).json({
  //   status: "Success",
  //   token,
  // });
});
exports.protect = catchAsync(async (req, res, next) => {
  if (req.cookie.jwt) {
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(
      req.cookie.jwt,
      process.env.JWT_SECRET
    );
    console.log(decoded);
    // 3)check user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }
    // 4)Check if user change password after the token was issued
    if (currentUser.changePasswordAfter(decoded.iat)) {
      return next();
    }
    res.locals.user = currentUser;
    next();
  }
  next();
});
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // 1)Getting tokenand
  if (req.cookies.jwt) {
    try {
      // 1) verify token

      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      console.log("here is ", decoded);
      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1)Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2)If token has not expired ,there is user ,set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3)Update changePasswordAt property for the user
  // 4)Log the user in,send JWT
  createSendToken(newUser, 200, res);
  // const token = signToken(newUser._id);
  // res.status(201).json({
  //   status: "Success",
  //   token,
  // });
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }
  // 2) generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3)send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to:${resetURL}.\nTf you didn't forgot your password then ignore this email!`;
  try {
    await sendMail({
      email: user.email,
      subject: "Your password reset token (Valid for only 10 minutes)",
      message,
    });
    res.status(200).json({
      status: "Success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending the email.Try again later", 500)
    );
  }
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1)Get user from collection
  const user = await User.findById(req.user.id).select("+password");
  // 2)Check if POSTed current Password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current pssword is wrong.", 401));
  }

  // 3)If so, updatePassword
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  // 4)Log user in,send JWT
  createSendToken(newUser, 200, res);
  // const token = signToken(newUser._id);
  // res.status(201).json({
  //   status: "Success",
  //   token,
  // });
});

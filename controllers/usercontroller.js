const User = require("./../models/userModel");
// const APIFeatures = require("./../utils/apifeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/apperror");
const factory = require("./handlerFactory");

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = factory.getAll(User);
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();
//   res.status(200).json({
//     status: "Success",
//     requestAt: req.requestTime,
//     result: users.length,
//     data: {
//       users,
//     },
//   });
// res.status(500).json({
//   status: "err",
//   message: "Successs",
// });
// });
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1)Create error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for password update.Please use /updateMyPassword",
        400
      )
    );
  }
  // 2)Filter out unwanted field names that are not allowed to be updated
  const filteredBody = filteredObj(req.body, "name", "email");
  // 3)Update user document
  // const user = await User.findById(req.user.id);
  // user.name = "Jonas";
  // await user.save();
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "Success",
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "Success",
    data: null,
  });
});

exports.getUser = factory.getOne(User);
// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: "err",
//     message: "Success",
//   });
// };
exports.createAllUsers = (req, res) => {
  res.status(201).json({
    status: "err",
    message: "this is not working",
  });
};

exports.createUser = (req, res) => {
  res.status(201).json({
    status: "err",
    message: "this is not working",
  });
};
// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: "err",
//     message: "this is not working",
//   });
// };
exports.updateUser = factory.updateOne(User);

// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "This route is not yet defined!",
//   });
// };

exports.deleteUser = factory.deleteOne(User);

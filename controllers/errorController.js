const AppError = require("./../utils/apperror");
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateErrorDB = (err) => {
  const value = err.errmsg(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const handleJsonWebTokenErrorDB = (err) => {
  const message = `Invalid token. Please login again`;
  return new AppError(message, 401);
};
const handleTokenExpiredError = (err) => {
  const message = "Token has expired. Please login again";
  return new AppError(message, 401);
};
// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack,
//   });
// };
// const sendErrorPro = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// };
const sendErrorDev = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went very wrong",
    });
  }
};
const sendErrorPro = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error 🌞", err);
    res.status(500).json({
      status: "error",
      message: "something went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // res.status(err.statusCode).json({
  //   status: err.status,
  //   message: err.message,
  // });
  // console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    // if (error.name === "CastError") error = handleCastErrorDB(error);
    // if (error.code === 11000) error = handleDuplicateErrorDB(error);
    // if (error.name === "JsonWebTokenError")
    //   error = handleJsonWebTokenErrorDB(error);
    // sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name == "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name == "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError")
      error = handleJsonWebTokenErrorDB(error);
    if (error.name === "TokenExpiredError")
      error = handleTokenExpiredError(error);
    // sendErrorPro(error, res);
  }
};

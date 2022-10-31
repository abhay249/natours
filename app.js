const express = require("express");
const path = require("path");
const res = require("express/lib/response");
const fs = require("fs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}/`));
// const idRouter = require("./routers/idRouter");
const tourRouter = require("./routers/toursRouter");
const userRouter = require("./routers/userRouter");
const reviewRouter = require("./routers/reviewRouter");
const viewRouter = require("./routers/viewRouter");
const AppError = require("./utils/apperror");

const globalErrorHandlers = require("./controllers/errorController");

app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));
// app.use(morgan("tiny"));

// Global middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "data:", "blob:", "https:", "ws:"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        scriptSrc: ["'self'", "https:", "http:"],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        workerSrc: ["'self'", "data:", "blob:"],
        childSrc: ["'self'", "blob:"],
        imgSrc: ["'self'", "data:", "blob:"],
        formAction: ["'self'"],
        connectSrc: [
          "'unsafe-inline'",
          "'self'",
          "data:",
          "blob:",
          "https://bundle.js:*",
          "ws://127.0.0.1:*/",
        ],
        upgradeInsecureRequests: [],
      },
    },
  })
);

// Set security HTTP headers
app.use(helmet());

// Development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// app.use((req, res, next) => {
//   console.log("hello in middleware");
//   next();
// });

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP,Please try again in an hour",
});

app.use("/api", limiter);
app.use((req, res, next) => {
  res.set("Content-Security-Policy", "connect-src *");
  next();
});
app.use(express.json());
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data Sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["duration"],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// app.get("/", (req, res) => {
//   res.status(200).json("Hello in get heee.. ");
// });

// app.post("/", (req, res) => {
//   res.send("Hello in post hhheee..");
// });

// const tourRouter = express.Router();
// const userRouter = express.Router();

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
// app.use("/api/v1/card", idRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find URL:${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Can't find URL:${req.originalUrl} on this server!`);
  // err.status = "fail";
  // err.statusCode = 404;
  // next(err);
  next(new AppError(`Can't find URL:${req.originalUrl} on this server!`, 404));
});

// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });
app.use(globalErrorHandlers);

// app.get("/api/v1/tours", (req, res) =>
//   res.status(200).json({
//     status: "Success",
//     results: tours.length,
//     data: {
//       tours,
//     },
//   })
// );

// app.post("/api/v1/tours", (req, res) => {
//   res.send({ message: "hello in Indian post" });
// });

// app.get("/api/v1/tours/:id", getAllTours);
// app.post("/api/v1/tours/:id", createtAllTours);
// app.patch("/api/v1/tours/:id", updateTours);
// app.delete("/api/v1/tours/:id", deleteTour);

// app
//   .route("/api/v1/tours/:id")
//   .get(getAllTours)
//   .post(createtAllTours)
//   .patch(updateTours)
//   .delete(deleteTour);

// app.route("/api/v1/users").get(getUser).post(createUser).patch(updateUser);

// app.route("/api/v1/users/:id").get(getAllUsers).post(createAllUsers);
module.exports = app;

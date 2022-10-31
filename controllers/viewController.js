const Tour = require("../models/toursModel");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");
// const card = require("../models/idModel");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1)Get tour data from collection
  const tours = await Tour.find();
  // 2)Build template

  // 3)Render that template using tour data from 1)

  res.status(200).render("overview", {
    title: "All tours",
    tours,
  });
  next();
});

// exports.getCard = catchAsync(async (req, res, next) => {
//   const Card = {
//     name: "abhay",
//     address: "gzb",
//   };
//   res.status(200).render("idBase", {
//     title: "Hello in your card",
//     Card,
//   });
//   next();
// });
exports.getUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).render("user", {
    title: "Users Page",
    users,
  });
  next();
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get data from collection,for the requested tour(including reviews and guides)
  const data = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  // 2) Build template
  // 3) Render template using data from 1)

  res.status(200).render("tour", {
    title: "The Forest Hiker Tour",
    data,
  });
  next();
});

// exports.getBase = async (req, res) => {
//   res.status(200).render("base", {
//     tour: "The Forest Hiker",
//     user: "Jonas",
//   });
// };

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    // .set("Content-Security-Policy", "connect-src 'self' http://127.0.0.1:3000/")
    .render("login", {
      title: "login into your account",
    });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render("signup", {
    title: "Sign up",
  });
};

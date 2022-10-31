const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");

const Tour = require("./models/toursModel");
const User = require("./models/userModel");
const Review = require("./models/reviewModel");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE_LOCAL;
//  process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((con) => {
    // console.log(con);
    console.log("DATABASE CONNECTED SUCCESSFULLY!!!");
  })
  .catch((err) => {
    console.log(err);
  });

const tours = JSON.parse(fs.readFileSync(`./tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`./users.json`, "utf-8"));
const reviews = JSON.parse(fs.readFileSync(`./reviews.json`, "utf-8"));

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users);
    await Review.create(reviews);

    console.log("Data loaded successfully!!!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log("Data deleted successfully!!!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] == "--import") {
  importData();
} else if (process.argv[2] == "--delete") {
  deleteData();
}
// console.log(process.argv);

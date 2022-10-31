const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");
const { doc } = require("prettier");

console.log(app.get("env"));
// console.log(process.env);
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    // .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log("DB connections successfully !!");
  });

// const tourSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "it requires a name"],
//     unique: true,
//   },
//   rating: {
//     type: Number,
//     default: 4.5,
//     // required: [true, "it requires a number"],
//   },
//   price: {
//     type: Number,
//     required: [true, "it requires a number"],
//   },
// });

// const testTour = new Tour({
//   name: "KGF2",
//   price: 699,
// });

// testTour
//   .save()
//   .then((docs) => console.log(docs))
//   .catch((err) => console.log("Error : ", err));

// .catch((err) => {
//   console.log(err);
// });

// dbConnect(DB)
//   .then((con) => {
//     console.log(con);
//     console.log("DB connections successfully !!");
//   })
//   .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// const app = require("./app");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// // This error handling will run incase there are uncaught exceptions like consoling something which doesn't exist.
// process.on("uncaughtException", (err) => {
//   console.log("Uncaught Exception!! Shutting down the server...");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

// dotenv.config({ path: "./config.env" });

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("DB sucessfully connected!!!!"));

// const port = process.env.PORT || 3000;
// const server = app.listen(port, () => {
//   console.log(`App running from port ${port}`);
// });

// The below will run incase server is unable to connect to database for any reason
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection!! Shutting down the server...");
  console.log(err.name, err);
  server.close(() => {
    process.exit(1);
  });
});

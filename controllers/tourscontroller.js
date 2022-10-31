// const fs = require("fs");
// const tours = JSON.parse(fs.readFileSync(`./tours.json`));
const Tour = require("./../models/toursModel");
const APIFeatures = require("./../utils/apifeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/apperror");
const factory = require("./handlerFactory");

// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   if (req.params.id * 1 > tours.length)
//     return res.status(404).json({
//       status: "fail",
//       message: "invalid id",
//     });
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.course) {
//     res.status().json({
//       status: "fail",
//       message: "Missing name or course",
//     });
//   }
//   next();
// };
// exports.getTour = (req, res) => {
//   console.log(req, requestTime);
//   res.status(200).json({
//     status: "Success",
//     data: {
//       tour: newTour,
//     },
//   });
// };
// exports.getAllTours = async (req, res) => {
//   // console.log(req.params);
//   console.log(req.requestTime);
//   // const id = req.params.id * 1;
//   try {
//     const tour = await Tour.find({ name: "RRR" });
//     // console.log(id);
//     // const tour = tours.find((el) => el.id === id);
//     res.status(200).json({
//       status: "Success",
//       requestAt: req.requestTime,
//       result: tour.length,
//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       data: {
//         message: err,
//       },
//     });
//   }
// };
// const id = "62a37834fb045b86f067ef84";

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingAverage,summary,difficulty";
  next();
};

// exports.getTours = async (req, res) => {
//   const x = await Tour.findById(req.params.id).populate("reviews");
//   if (!x) {
//     return next(new AppError("No result found with this ID", 404));
//   }
//   // try {
//   res.status(200).json({
//     status: "Success",
//     data: {
//       x,
//     },
//   });
//   // } catch (err) {
//   //   console.log(err);
//   // }
// };

exports.getTours = factory.getOne(Tour, { path: "reviews" });

exports.getAllTours = factory.getAll(Tour);
// exports.createtAllTours = factory.createOne(Tour);

// exports.getAllTours = async (req, res) => {
// console.log(req.params);
// console.log(req.requestTime);
// console.log(req.query);
// const id = req.params.id * 1;

// try {
// // const tour = await Tour.findById(req.params.id);
// const tour = await Tour.findById(req.query);
//1) Filtering
// const queryObj = { ...req.query };
// const excludedField = ["page", "sort", "limit", "fields"];
// excludedField.forEach((el) => delete queryObj[el]);
//2) Advance filtering
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
// console.log(JSON.parse(queryStr));

// let query = Tour.find(JSON.parse(queryStr));
// 3) Sorting
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(",").join(" ");
//   console.log(sortBy);
//   query = query.sort(sortBy);
//   // query = query.sort(req.query.sort);
// } else {
//   query = query.sort(`-createdAt`);
// }

//4) Field limiting
// if (req.query.fields) {
//   const fields = req.query.fields.split(",").join(" ");
//   query = query.select(fields);
// } else {
//   query = query.select("-__v");
// }

// 5) Pagination
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;
// query = query.skip(skip).limit(limit);

// if (req.query.page) {
//   const numTour = await Tour.countDocuments();
//   if (skip >= numTour) throw new Error("This page does not exist");
// }

// // const features = new APIFeatures(Tour.find(), req.query)
////   .filter()
// //  .sort()
//   //.limitFields()
// //  .pagination();
// //const tours = await features.query;
// console.log(req.query);
// console.log(id);
// const query = Tour.find(queryObj);

// const tour = tours.find((el) => el.id === id);
// //res.status(200).json({
//   //status: "Success",
//   //requestAt: req.requestTime,
//  // result: tours.length,
//  // data: {
//   //  tours,
//  // },
//// });
// }
//  catch (err) {
//   // console.log(err);
//   res.status(404).json({
//     status: "fail",
//     data: {
//       message: err,
//     },
//   });
// }
// };

// exports.createtAllTours = async (req, res) => {
//   try {
//     const newTour = await Tour.create(req.body);
//     // // const newId = tours[tours.length - 1].id + 1;
//     // const newTour = Object.assign({ id: newId }, req.body);
//     // tours.push(newTour);
//     // fs.writeFile(`${__dirname}/tours.json`, JSON.stringify(tours), (err) => {
//     res.status(201).json({
//       status: "success",
//       data: {
//         tour: newTour,
//       },
//     });
//   } catch (err) {
//     // console.log(err);
//     res.status(404).json({
//       status: "fail",
//       data: {
//         message: err,
//       },
//     });
//   }
//   // });
//   // console.log(req.body);
//   // res.send("Done");
// };
// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next());
//   };
//   // fn(req, res, next).catch((err) => next(err));
// };

exports.createtAllTours = factory.createOne(Tour);
// exports.createtAllTours = catchAsync(async (req, res, next) => {
// const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: "success",
//     data: {
//       tour: newTour,
//     },
//   });
// try {
// const newTour = await Tour.create(req.body);
//   // // const newId = tours[tours.length - 1].id + 1;
//   // const newTour = Object.assign({ id: newId }, req.body);
//   // tours.push(newTour);
//   // fs.writeFile(`${__dirname}/tours.json`, JSON.stringify(tours), (err) => {
//   res.status(201).json({
//     status: "success",
//     data: {
//       tour: newTour,
//     },
//   });
// } catch (err) {
//   // console.log(err);
//   res.status(404).json({
//     status: "fail",
//     data: {
//       message: err,
//     },
//   });
// }
// });
// console.log(req.body);
// res.send("Done");
// });

exports.updateTours = factory.updateOne(Tour);

// exports.updateTours = async (req, res) => {
//   try {
//     const updatedTour = await Tour.updateOne({ name: "RRR" }, { price: 499 });
//     res.status(200).json({
//       status: "success story",
//       data: {
//         tour: updatedTour,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       data: {
//         message: err,
//       },
//     });
//   }
// };

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = async (req, res) => {
//   try {
//     const delTour = await Tour.deleteMany();
//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail to delete",
//       data: {
//         message: err,
//       },
//     });
//   }
// };

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // _id: null,
          _id: { $toUpper: "$difficulty" },
          // _id: "$ratingAverage",
          numTours: { $sum: 1 },
          numRating: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      {
        $match: { _id: { $ne: "EASY" } },
      },
    ]);
    res.status(200).json({
      status: "Success",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    // console.log(year);
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: {
          month: `$_id`,
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 6,
      },
    ]);
    // console.log(plan);
    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(
      new AppError(
        "Please provide Latitude or Longitute in the given format lat,lng",
        400
      )
    );
  }
  const tours = await Tour.find({
    startLocation: { $geowithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: "Success",
    results: tours.length,
    data: { data: { tours } },
  });
});

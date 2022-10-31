const express = require("express");
const fs = require("fs");
const tourscontroller = require(`./../controllers/tourscontroller`);
const authController = require("./../controllers/authController");
// const reviewController = require("./../controllers/reviewController");
const reviewRouter = require("./../routers/reviewRouter");
const app = express();
const router = express.Router();

// router.param("id", tourscontroller.checkId);

router
  .route("/tours-within/:distance/center/:latlag/unit/:unit")
  .get(tourscontroller.getToursWithin);

// app.get("/api/v1/tours", (req, res) =>
//   res.status(200).json({
//     status: "Success",
//     results: tours.length,
//     data: {
//       tours,
//     },
//   })
// );
// router.route("/").get(tourscontroller.getAllTours);
// .post(tourscontroller.createTour)
// .patch(tourscontroller.updateTours)
// .delete(tourscontroller.deleteTour);
// router.route("/:id").get(tourscontroller.getTours);

// POST /tours/2fab55/reviews This is nested routing
// GET /tours/2fab55/reviews This is nested routing
// GET /tours/2fab55/reviews/121abn This is nested routing

// router.route(
//   "/:tourId/reviews",
//   authController.protect,
//   authController.restrictTo("User"),
//   reviewController.createReview
// );

router.use("/:id/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(tourscontroller.aliasTopTours, tourscontroller.getAllTours);

router.route("/tour-stats").get(tourscontroller.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourscontroller.getMonthlyPlan
  );
router
  .route("/")
  .get(tourscontroller.getAllTours)
  // .post(tourscontroller.checkBody, tourscontroller.createtAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourscontroller.createtAllTours
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourscontroller.updateTours
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourscontroller.deleteTour
  );

module.exports = router;

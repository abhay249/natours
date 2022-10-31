const express = require("express");
const router = express.Router({ mergeParams: true });
// const fs = require("fs");
// const review = require("../models/reviewModel");
// const app = express();
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

module.exports = router;

const mongoose = require("mongoose");
const { promises } = require("nodemailer/lib/xoauth2");
const slugify = require("slugify");
const validator = require("validator");
// const User = require("./userModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "it is required"],
      maxlength: [40, "A tour name should not be greater than 40"],
      minlength: [10, "A tour name should not be less than 10"],
      // validate: [validator.isAlpha, "Tour name must only contain alphabets"],
    },
    duration: {
      type: Number,
      required: [true, "it is required field"],
    },
    slug: String,
    maxGroupSize: {
      type: Number,
      required: [true, "it is required field"],
    },
    difficulty: {
      type: String,
      required: [true, "it is required field"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium ,difficult",
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be below 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "it is required"],
    },
    priceDiscount: {
      type: Number,
      // validate: function (val) {
      //   return val < this.price;
      // },
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount ({VALUE}) should be less than original price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "it is required field"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "it is required field"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GetJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    // reviews: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "review",
    //   },
    // ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual("reviews", {
  ref: "review",
  foreignField: "tour",
  localField: "_id",
});
// tourSchema.pre("save", function (next) {
//   console.log("Will save document...");
//   next();
// });
// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

tourSchema.pre("save", function (next) {
  console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// This for embedding basically
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async (el) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// Query middleware
// tourSchema.pre("find", function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

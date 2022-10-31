const express = require("express");
const router = express.Router();

const viewController = require(".././controllers/viewController");
const authController = require(".././controllers/authController");
// router.get("/", viewController.getBase);
// router.use(authController.isLoggedIn);

router.get("/", authController.isLoggedIn, viewController.getOverview);
router.get("/user", authController.isLoggedIn, viewController.getUser);
router.get("/tour/:slug", authController.isLoggedIn, viewController.getTour);

// router.get("/idcard", viewController.getCard);

// login
router.get("/login", viewController.getLoginForm);

router.get("/signup", viewController.getSignupForm);

module.exports = router;

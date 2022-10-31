const express = require("express");
const router = express.Router();
const usercontroller = require("./../controllers/usercontroller");
const authController = require("./../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);
router.patch("/updateMe", usercontroller.updateMe);
router.delete("/deleteMe", usercontroller.deleteMe);

router.get("/me", usercontroller.getMe, usercontroller.getUser);

router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(usercontroller.getAllUsers)
  .post(usercontroller.createUser);
// .patch(usercontroller.updateUser);

router
  .route("/:id")
  .get(usercontroller.getUser)
  // .post(usercontroller.createAllUsers);
  .patch(usercontroller.updateUser)
  .delete(usercontroller.deleteUser);

module.exports = router;

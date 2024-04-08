const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/userAuth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination where uploaded files will be stored
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    // Define the filename for uploaded files
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", auth.isLogin, userController.home);

router.get("/login", auth.isLogout, userController.login);

router.post("/login", auth.isLogout, userController.login);

router.get("/signup", auth.isLogout, userController.signup);

router.post("/signup", auth.isLogout, userController.signup);

router.get("/logout", auth.isLogin, userController.logout);

router.get("/edit-profile", auth.isLogin, userController.editProfile);

router.post(
  "/edit-profile",
  auth.isLogin,
  upload.single("image"),
  userController.editProfile
);

module.exports = router;

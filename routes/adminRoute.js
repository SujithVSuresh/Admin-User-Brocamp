const express = require("express");
const adminController = require("../controllers/adminController");
const auth = require("../middleware/adminAuth");
const multer = require("multer");

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

router.get("/", auth.isAdminLogout, adminController.login);

router.post("/", auth.isAdminLogout, adminController.login);

router.get("/logout", auth.isAdminLogin, adminController.logout);

router.get("/dashboard", auth.isAdminLogin, adminController.dashboard);

router.get(
  "/dashboard/fetch-all-users",
  auth.isAdminLogin,
  adminController.fetchAllUsers
);
router.get(
  "/dashboard/search-users",
  auth.isAdminLogin,
  adminController.searchUsers
);
router.get("/dashboard/add-user", auth.isAdminLogin, adminController.addUser);
router.post("/dashboard/add-user", auth.isAdminLogin, adminController.addUser);

router.get("/dashboard/edit-user", auth.isAdminLogin, adminController.editUser);
router.post(
  "/dashboard/edit-user",
  auth.isAdminLogin,
  upload.single("image"),
  adminController.editUser
);

router.post(
  "/dashboard/delete-user",
  auth.isAdminLogin,
  adminController.deleteUser
);

module.exports = router;

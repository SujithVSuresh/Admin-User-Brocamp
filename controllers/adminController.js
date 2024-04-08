const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  if (req.method === "GET") {
    if (req.session.userId) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("admin/login");
    }
  }

  if (req.method === "POST") {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email, is_admin: true });
    console.log("HI", user, "email & pass", email, password);

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.adminId = user._id;
      res.redirect("/admin/dashboard");
    } else {
      res.status(401).send("Invalid username or password");
    }
  }
};

const dashboard = async (req, res) => {
  res.render("admin/dashboard");
};

const fetchAllUsers = async (req, res) => {
  console.log("uuii", req);
  const data = await User.find({ is_admin: false });
  console.log(data, "ooi");
  res.json(data);
};

const searchUsers = async (req, res) => {
  const query = req.query.query.toLowerCase();

  const data = await User.find({ is_admin: false });

  const filteredData = data.filter((data) =>
    data.name.toLowerCase().includes(query)
  );
  res.json(filteredData);
};

const addUser = async (req, res) => {
  if (req.method === "GET") {
    res.render("admin/add-user");
  }

  if (req.method === "POST") {
    const { name, email, phone, password2 } = req.body;
    const hashedPassword = await bcrypt.hash(password2, 10);
    const newUser = new User({
      name: name,
      email: email,
      mobile: phone,
      password: hashedPassword,
    });
    await newUser.save();
    res.redirect("/admin/dashboard");
  }
};

const editUser = async (req, res) => {
  if (req.method === "GET") {
    const id = req.query.id;

    const user = await User.findOne({ is_admin: false, _id: id });

    if (user) {
      res.render("admin/edit-user", { data: user });
    } else {
      res.redirect("/admin");
    }
  }

  if (req.method === "POST") {
    const { name, email, phone } = req.body;

    if (req.file) {
      const userData = await User.findByIdAndUpdate(
        { _id: req.query.id },
        {
          $set: {
            name: name,
            email: email,
            image: req.file.filename,
            mobile: phone,
          },
        }
      );
    } else {
      const userData = await User.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: { name: name, email: email, mobile: phone } }
      );
    }

    res.redirect("/admin/dashboard");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);

    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

const logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
      res.send("Error");
    } else {
      res.redirect("/admin");
    }
  });
};

module.exports = {
  login,
  logout,
  dashboard,
  fetchAllUsers,
  searchUsers,
  addUser,
  editUser,
  deleteUser,
};

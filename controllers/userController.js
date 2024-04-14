const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const home = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.session.userId,
      is_admin: false,
    });
    if (user) {
      res.render("user/home", { data: user });
    } else {
      res.redirect("/logout");
    }
  } catch (err) {
    console.error(err);
  }
};

const login = async (req, res) => {
  if (req.method === "GET") {
    res.render("user/login");
  }
  if (req.method === "POST") {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (
      user &&
      (await bcrypt.compare(password, user.password)) &&
      !user.is_admin
    ) {
      req.session.userId = user._id;
      // res.redirect("/");
      res.status(200).json({ message: "login successfull" });
    } else {
      // res.render("user/login", {
      //   msg: "User with this credentials does not exist",
      // });

      res.status(401).json({ message: "No user found with these credentials." });
    }
  }
};

const signup = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { name, email, phone, password } = req.body;

      const checkUser = await User.findOne({email: email})
      
      if(!checkUser){

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
        name: name,
        email: email,
        mobile: phone,
        password: hashedPassword,
      });
      await newUser.save();
      // res.redirect("/login");
      res.status(200).json({ message: "login successfull" })

      }else{
        res.status(401).json({ message: "User with this email address already exist." })
      }
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
  if (req.method === "GET") {
    res.render("user/signup");
  }
};

const logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
      res.send("Error");
    } else {
      res.redirect("/login");
    }
  });
};

const editProfile = async (req, res) => {
  if (req.method === "GET") {
    const userData = await User.findOne({ _id: req.session.userId });
    res.render("user/edit-profile", { data: userData });
  }
  if (req.method === "POST") {
    const { name, email, phone } = req.body;

    const checkUser = await User.findOne({email: email, _id:{$ne: req.session.userId }})
      
    if(!checkUser){
    if (req.file) {
      const userData = await User.findByIdAndUpdate(
        { _id: req.session.userId },
        {
          $set: {
            name: name,
            email: email,
            image: req.file.filename,
            mobile: phone,
          },
        }
      );
      res.status(200).json({ message: "Profile updated successfully" })
    } else {
      const userData = await User.findByIdAndUpdate(
        { _id: req.session.userId },
        { $set: { name: name, email: email, mobile: phone } }
      );
      res.status(200).json({ message: "Profile updated successfully" })
    }
  }else{
    res.status(401).json({ message: "User with this email address already exist." })
  }
  }
};

module.exports = {
  home,
  login,
  signup,
  logout,
  editProfile,
};

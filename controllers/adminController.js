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

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.adminId = user._id;
      //res.redirect("/admin/dashboard");
      res.status(200).json({ message: "login successfull" });
    } else {
      //res.status(401).send("Invalid username or password");
      res.status(401).json({ message: "No user found with these credentials." });
    }
  }
};

const dashboard = async (req, res) => {
  
  const admin = await User.findOne({ _id: req.session.adminId });
  console.log("admin", admin);
  res.render("admin/dashboard", {data: admin});
};

const fetchAllUsers = async (req, res) => {
  console.log(req.query.search, "jiij")
  if(!req.query.search){
  const data = await User.find({ is_admin: false });
  res.json(data);
  }else{
    const query = req.query.search.toLowerCase();

  const data = await User.find({ is_admin: false });

  const filteredData = data.filter((data) =>
    data.name.toLowerCase().includes(query)
  );
  res.json(filteredData);

  }
};


const addUser = async (req, res) => {
  if (req.method === "GET") {
    res.render("admin/add-user");
  }

  if (req.method === "POST") {
    
    const { name, email, phone, password } = req.body;

    const checkUser = await User.findOne({email: email})
 
    if(!checkUser){
    const hashedPassword = await bcrypt.hash(password, 10);
    if(req.file){
      const newUser = new User({
        name: name,
        email: email,
        mobile: phone,
        password: hashedPassword,
        image: req.file.filename,
      });
      await newUser.save();
    }else{
      const newUser = new User({
        name: name,
        email: email,
        mobile: phone,
        password: hashedPassword,
      });
      await newUser.save();
    }
    
    
    //res.redirect("/admin/dashboard");
    res.status(200).json({ message: "User created successfully" })
  }else{
    res.status(401).json({ message: "User with this email address already exist." })
  }
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
    console.log("guiog");
      const { name, email, phone, id } = req.body;

    const checkUser = await User.findOne({email: email, _id:{$ne: id}})
      
    if(!checkUser){
    if (req.file) {
      const userData = await User.findByIdAndUpdate(
        { _id: id },
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
        { _id: id },
        { $set: { name: name, email: email, mobile: phone } }
      );
      res.status(200).json({ message: "Profile updated successfully" })
    }
  }else{
    res.status(401).json({ message: "User with this email address already exist." })
  }
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

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
  addUser,
  editUser,
  deleteUser,
};

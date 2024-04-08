const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, require: true },
  image: { type: String, required: false },
  password: { type: String, required: true },
  is_admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("user", userSchema);

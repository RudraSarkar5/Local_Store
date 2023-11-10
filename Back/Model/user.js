const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  location: {
    type: String,
  },
  profilePhoto: {
    type: String,
  
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;

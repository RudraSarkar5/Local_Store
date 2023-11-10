const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/Product-Market")
    .then(() => console.log("Connected!"))
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
};

module.exports = { dbConnect };

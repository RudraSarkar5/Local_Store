const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productName: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: String,
  },

  productImages: {
    type: Array,
  },
  userId: {
    type: String,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

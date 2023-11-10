const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
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
  qty:{
    type:Number,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;

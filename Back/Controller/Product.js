const { Router } = require("express");
const multer = require("multer");
const Product = require("../Model/products");
const router = Router();
const Cart = require("../Model/cart");
const { route } = require("./User");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/productsUpload");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.patch("/update/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/userProducts/:id", async (req, res) => {
  const product = await Product.find({ userId: req.params.id });
  return res.status(200).send(product);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  return res.status(200).json(product);
});

router.delete("/:id", async (req, res) => {
  await Product.findByIdAndRemove(req.params.id);
  res.json({ status: "success" });
});

router.post("/addProduct", upload.array("productImages", 100000), (req, res) => {
  const images = req.files.map((file) => file.filename);
  if ( images.length > 4){
   return res.status(400).json({message : "Please Select Maximum 4 images", reason : "images"});
  }
  const { productName, description, price, email } = req.body;
  Product.create({
    productName: productName,
    description: description,
    price: price,
    productImages: images,
    userId: email,
  })
    .then((product) => {
      res.status(201).json(product);
    })
    .catch((err) => {
      console.error("Product creation error:", err);
      res.status(500).json({ error: "Product creation failed" });
    });
});

router.post("/addCart", async (req, res) => {
  const { _id, productName, description, price, productImages } =
    req.body.product;
  const existingItem = await Cart.findOne({ _id, userId: req.body.userId });
  if (existingItem) {
    console.log('enter 2nd time')
   const response = await Cart.findByIdAndUpdate(existingItem._id,{qty:existingItem.qty+1});
    return  res.status(200).json(existingItem);
  }
  Cart.create({
    _id: _id,
    productName,
    description,
    price,
    productImages,
    userId: req.body.userId,
    qty:1
  })
    .then((product) => {
      res.status(201).json(product);
    })
    .catch((err) => {
      console.error("Product creation error:", err);
      res.status(500).json({ error: "Product creation failed" });
    });
});

router.get("/", (req, res) => {
  Product.find({})
    .then((products) => {
      res.status(200).send(products);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

router.delete("/remove/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const removedItem = await Cart.findByIdAndRemove(itemId);

    if (!removedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart" });
  }
});

module.exports = router;

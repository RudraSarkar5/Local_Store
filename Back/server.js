const express = require("express");
const { createServer } = require("node:http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Product = require("./Model/products");
const UnReadMsg = require('./Model/unreadmsg')
const User = require("./Model/user");
const path = require("path");
const { Server } = require("socket.io");
const userRouter = require("./Controller/User");
const chatRouter = require("./Controller/chat");
const productRouter = require("./Controller/Product");
const { dbConnect } = require("./Database/db");
const { checkAuthentification } = require("./midleware/checkAuth");
const Cart = require("./Model/cart");
const PORT = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

dbConnect();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRouter);
app.use("/products", checkAuthentification("token"), productRouter);
app.delete(
  "/user/deleteAccount/:id",
  checkAuthentification("token"),
  async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.deleteOne({ _id: userId });
      const userProducts = await Product.deleteMany({ userId: userId });
      const allCart = await Product.deleteMany({ userId: userId });
      const unreadmsg = await UnReadMsg.deleteOne({ _id: userId });

      res.status(200).json({ msg: "successfully deleted" });
    } catch (err) {
      res.status(400).json({ msg: "error happend to do delete" });
    }
  }
);

app.get("/getCart/:id", checkAuthentification("token"), (req, res) => {
  Cart.find({ userId: req.params.id })
    .then((cart) => {
      res.status(200).send(cart);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get(
  "/userDetails/:id",
  checkAuthentification("token"),
  async (req, res) => {
    const user = await User.findById(req.params.id);
    
    return res.status(200).json({ user });
  }
);

app.use("/chat",checkAuthentification("token"),  chatRouter);


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("chatget", (msg) => {
    io.to(msg.receiver).emit("chat", msg);
    // io.to(msg.sender).emit("chat", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(PORT, () => {
  console.log("Server running successfully");
});

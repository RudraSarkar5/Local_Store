const { Router } = require("express");
const multer = require("multer");
const User = require("../Model/user");
const { getToken, validateToken } = require("../Authentication/auth");
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/productsUpload");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/signup", upload.single("profilePhoto"), async (req, res) => {
  const { fullName, email, password, location } = req.body;
  if(!req.file){
    profilePath= 'avatar.png'
  }else{
     profilePath= req.file.filename;
  }
  try {
    const existingUser = await User.find({ email: email });
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already Exist" });
    }

    const newUser = await User.create({
      fullName: fullName,
      email: email,
      password: password,
      location: location,
      profilePhoto: profilePath,
    });

    const token = getToken(newUser);
    res.cookie("token", token);
    return res.status(200).json({ id: newUser._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (user.password == password) {
      const token = getToken(user);
      res.cookie("token", token);
      return res.status(200).json({ id: user._id });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

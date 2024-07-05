const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const Poll = require("../models/pollSchema");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const cloudinary = require('../utils/cloudinary');


const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpeg, jpg, and png files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

router.get("/:id",authMiddleware,async function(req, res) {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Unexpected Error Occurred" });
  }
});

router.get('/:userId/polls', authMiddleware, async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    let polls;
    if (page && limit) {
      polls = await Poll.find({ creator: userId })
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      polls = await Poll.find({ creator: userId });
    }

    res.status(200).json(polls);
  } catch (error) {
    res.status(500).send(error);
  }
});




router.post('/:id/upload-profile-picture', upload.single('profilePicture'), authMiddleware, async (req, res) => {
  const userId = req.params.id;

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.secure_url },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = router;


const express = require('express');
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const pollRoutes = require("./routes/polls");

const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("./models/userSchema");
const Poll = require("./models/pollSchema");
const Vote = require("./models/voteSchema");
const authMiddleware = require('./middleware/authMiddleware');

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log("Connected to MongoDB");
});

app.use(cors({
  origin:["https://poll-app-frontend-eight.vercel.app"],
  methods:["POST", "GET"],
  credentials: "true"
}));
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/user", userRoutes);
app.use("/polls", pollRoutes);




app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to Polls App");
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || name.trim() === "" || email.trim() === "" || password.trim() === "") {
    return res.status(400).json({ message: "Invalid inputs" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({ username: name, email, password: hashedPassword });

  try {
    await user.save();
    res.status(200).json({ message: "User added" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.status(404).json({ message: "Unable to find user" });
    }

    const isPassword = bcrypt.compareSync(password, existingUser.password);

    if (!isPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.USER_JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Successfully logged in", id: existingUser._id, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/create", authMiddleware,async function(req,res){
    const { question, options, userId } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const newPoll = new Poll({
        question,
        options,
        creator: userId,
      });
      const savedPoll = await newPoll.save();
      user.createdPolls.push(savedPoll._id);
      await user.save();
      res.status(201).json(savedPoll);
    } catch (error) {
      console.error('Error creating poll:', error);
      res.status(500).json({ error: 'Server error' });
    }
  })




io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

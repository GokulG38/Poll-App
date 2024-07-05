const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const authMiddleware = async (req, res, next) => {
    console.log(req.headers)
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.USER_JWT_SECRET); 
    console.log(decoded)
    const user = await User.findById(decoded.id); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    req.user = user;
    console.log("done")
    next(); 
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;

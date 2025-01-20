const jwt = require("jsonwebtoken");
const { Usermodel } = require("../models/userSchema");

const Authmiddle = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).send("please login");
    }
    const decodemessage = await jwt.verify(token, "Dev@123");
    
    const { _id } = decodemessage;
    if (!_id) {
      throw new Error("Invalid token");
    }

    const user = await Usermodel.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();

  } catch (error) {
    
  res.status(401).send("Error: " + error.message);
  }
};

module.exports = {Authmiddle};

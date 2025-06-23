import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import 'dotenv/config';

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "No authentication token" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: 'Token invalid' });

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default protectRoute;

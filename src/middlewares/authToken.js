import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

async function authToken(req, res, next) {
//   if (req.method === "OPTIONS") {
//     return next();
//   }

  // console.log(req.headers.authorization);
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication failed!" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decodedToken;
    next();
  } catch (error) {
    return next(res.status(401).json({ message: "Authentication failed!" }));
  }
}

export default authToken;
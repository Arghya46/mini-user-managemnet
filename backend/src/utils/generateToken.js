import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,   // make sure you have JWT_SECRET in your .env
    { expiresIn: "1d" }       // token valid for 1 day
  );
};

export default generateToken;

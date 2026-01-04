import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authorized, token missing"
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.userId = decoded.id;
     req.role = decoded.role;  
     console.log(req.userId, req.role);

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token"
    });
  }
};

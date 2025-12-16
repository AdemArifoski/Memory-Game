import jwt from "jsonwebtoken"

function authMiddleware (req, res, next) {
  const token = req.headers["authorization"]

  if(!token) {return res.status(401).json({message: "No token provided"})}

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({message: "Invalid token"})
    }

    req.playerId = decoded.id
    next()
  })
}

export default authMiddleware
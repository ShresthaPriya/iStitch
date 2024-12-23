const jwt = require("jsonwebtoken");

function verifyToken(res, req, next){
    const token = req.header("Authorization");
    if(!token){
        return res.status(401).json({message:"Access denied"})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        res.status(403).json({message: "Invalid token."})
    }
}

module.exports = verifyToken;
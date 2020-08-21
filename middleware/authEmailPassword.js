const jwt = require('jsonwebtoken');
require('dotenv').config();

//some secrets 
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

module.exports = function authEmailPassword(req, res, next){
    const accessToken = req.cookies.jwt;
    try {
        let id =jwt.verify(accessToken, JWT_SECRET).id;
        req.userID = id;
    } catch (error) {
        return res.status(401).json({message: "Re verify your JWT token!"})
    }
    
    next();
}
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized access",
            });
        }

        // Verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find user by ID

        const user = await userModel.findById(decoded.id).select("-password");
        req.user = user;
        next();

    } catch (error) {
        console.error("Auth error:", error);
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
}

module.exports = auth;
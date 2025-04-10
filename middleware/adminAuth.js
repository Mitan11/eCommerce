const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const adminAuth = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.jwt;
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in. Please log in to get access.'
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'user not exist.'
            });
        }
        
        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action. admin access required.'
            });
        }
        
        // Grant access to protected route
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid token. Please log in again.'
        });
    }
};

module.exports = adminAuth;
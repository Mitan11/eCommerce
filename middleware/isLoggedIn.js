const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isLoggedIn = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.jwt;
        
        // If token exists, user is logged in
        if (token) {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Check if user still exists
            const user = await User.findById(decoded.id);
            if (user) {
                // User is logged in, redirect to appropriate dashboard
                if (user.role === 'admin') {
                    return res.redirect('/api/v1/admin/dashboard');
                } else {
                    return res.redirect('/api/v1/user/dashboard');
                }
            }
        }
        
        // User is not logged in, continue to login/register page
        next();
    } catch (error) {
        // Invalid token, continue to login/register page
        next();
    }
};

module.exports = isLoggedIn; 
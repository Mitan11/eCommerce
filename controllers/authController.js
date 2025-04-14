const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide all required fields",
            });
        }

        
        const existUser = await userModel.findOne({ email });

        if (existUser) {
            return res.status(400).json({
                status: "fail",
                message: "User already exists",
            });
        }

        
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: "fail",
                message: "Password and confirm password do not match",
            });
        }

        
        if (password.length < 6) {
            return res.status(400).json({
                status: "fail",
                message: "Password must be at least 6 characters long",
            });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        
        res.redirect("/");


    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
};


const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide all required fields",
            });
        }

        
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: "User does not exist",
            });
        }


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid credentials",
            });
        }


        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
        );

    
        res.cookie("jwt", token);

        if (user.role === 'admin') {
            res.redirect("/api/v1/admin/dashboard");
        } else {
            res.redirect("/api/v1/user/dashboard");
        }

        

    }

    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
}

const logout = async (req, res) => {

    try {
        
        res.clearCookie("jwt");

        
        res.redirect("/");


    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
}

module.exports = {
    register,
    login,
    logout,
};
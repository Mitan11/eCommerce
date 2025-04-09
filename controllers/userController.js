const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validate input
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide all required fields",
            });
        }

        // Check if user already exists
        const existUser = await userModel.findOne({ email });

        if (existUser) {
            return res.status(400).json({
                status: "fail",
                message: "User already exists",
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: "fail",
                message: "Password and confirm password do not match",
            });
        }

        // Password length check
        if (password.length < 6) {
            return res.status(400).json({
                status: "fail",
                message: "Password must be at least 6 characters long",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user to database
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // Redirect after successful registration
        res.redirect("/");

        // Optional JSON response (for API usage)
        // res.status(201).json({
        //     status: "success",
        //     data: {
        //         user,
        //     },
        // });

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

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide all required fields",
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: "User does not exist",
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid credentials",
            });
        }

        // Redirect after successful login
        res.redirect("/api/v1/user/dashboard");

        // res.status(200).json({
        //     status: "success",
        //     message: "Login successful",
        //     data: {
        //         user,
        //     },
        // });

    }

    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
}

module.exports = {
    register,
    login,
};

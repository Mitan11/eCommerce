const logout = async (req, res) => {

    try {
        // Clear the cookie
        res.clearCookie("jwt");

        // Redirect to home page after logout
        res.redirect("/");

        // Optional JSON response (for API usage)
        // res.status(200).json({
        //     status: "success",
        //     message: "Logout successful",
        // });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
}

module.exports = {
    logout,
};
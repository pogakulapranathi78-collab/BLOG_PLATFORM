const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        // Get token from headers
        const token = req.header("Authorization");

        // Check token exists
        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // Verify token
        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Save user data in request
        req.user = verified;

        next();

    } catch (error) {

        res.status(400).json({
            message: "Invalid token"
        });

    }

};

module.exports = authMiddleware;
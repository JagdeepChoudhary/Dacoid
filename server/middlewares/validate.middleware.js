
import jwt from "jsonwebtoken";

const validateuser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Access denied, No token provided",
            success: false,
        });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(403).json({
            message: "Invalid token",
            success: false,
        });
    }
};

export default validateuser;

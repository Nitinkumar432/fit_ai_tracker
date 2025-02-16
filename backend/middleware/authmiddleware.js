import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const authenticateUser = (req, res, next) => {
    // Extract token from cookies
    const token = req.cookies.authToken; // Assuming the cookie is named "authToken"

    if (!token) {
        return res.status(401).json({ error: "Access Denied: No Token Provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request

        console.log("🟢 User Authenticated:", decoded); // Print user data to console

        next(); // Proceed to the next middleware/route
    } catch (err) {
        console.error("🔴 Invalid Token Error:", err.message);
        return res.status(403).json({ error: "Invalid Token" });
    }
};

export default authenticateUser;  // ✅ Default export

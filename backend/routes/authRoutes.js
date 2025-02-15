import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/UserSchema.js";
import { ensureAuthenticated, preventAuthAccess } from "../middleware/authmiddleware.js";

const router = express.Router(); 
// ✅ Ensure JSON body is parsed correctly
router.post("/register", async (req, res) => {
    console.log("Request Body:", req.body); 

    try {
        const { name, email, password, age, gender, height, weight } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        user = new User({ name, email, password, age, gender, height, weight });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("🔥 Error in Registration:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});



// User Login
router.post("/login", async (req, res) => {
    console.log("login route",req.body);

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        user.lastLogin = new Date(); // Update last login
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// Middleware for authentication
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
// preventing to access 
router.get("/login", preventAuthAccess, (req, res) => {
    res.json({ message: "Please log in to continue." });
});

router.get("/register", preventAuthAccess, (req, res) => {
    res.json({ message: "Create an account to get started." });
});

// Fetch User Profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

export default router;

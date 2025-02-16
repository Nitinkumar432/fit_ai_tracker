import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Exercise from "../Models/exercisesschema.js";
import User from "../Models/UserSchema.js";
import authenticateUser from "../middleware/authMiddleware.js"; // ✅ Correct default import
import cookieParser from "cookie-parser";

const router = express.Router(); 
router.use(cookieParser());
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
    console.log("login route", req.body);

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        user.lastLogin = new Date(); // Update last login
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Set HTTP-Only Cookie with Token
        res.cookie("authToken", token, {
            secure:false,
            maxAge: 3600000, // 1 hour expiration
        });

        res.json({ message: "Login successful", user });
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
// router.get("/login", preventAuthAccess, (req, res) => {
//     res.json({ message: "Please log in to continue." });
// });

// router.get("/register", preventAuthAccess, (req, res) => {
//     res.json({ message: "Create an account to get started." });
// });

// Fetch User Profile
router.get("/profile", authenticateUser, async (req, res) => {
    console.log(req.user.email);
    try {
        // ✅ Fetch user using email instead of userId
        const user = await User.findOne({ email: req.user.email }).select("-password");
        
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("❌ Error Fetching Profile:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});
router.get("/allExercises",authenticateUser, async (req, res) => {
    console.log("called");
    console.log(req.user.email); // Log the user's email for debugging

    try {
        // ✅ Fetch exercises using the authenticated user's email
        const exercises = await Exercise.find({ email: req.user.email });

        if (exercises.length === 0) {
            return res.status(404).json({ message: "No exercises found for this user" });
        }

        // Send all exercise data back
        res.status(200).json(exercises);
    } catch (error) {
        console.error("❌ Error Fetching Exercises:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

export default router;

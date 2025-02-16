import express from "express";
import Exercise from "../Models/exercisesschema.js";
import User from "../Models/UserSchema.js";
import authenticateUser from "../middleware/authMiddleware.js"; // ✅ Correct default import
import cookieParser from "cookie-parser";

const router = express.Router();

const authenticateUser2 = (req, res, next) => {
    // Extract token from cookies
    const token = req.cookies.authToken; // Assuming the cookie is named "authToken"

    if (!token) {
        return res.status(401).json({ error: "Access Denied: No Token Provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request
        x=req.user.email;

        console.log("🟢 User Authenticated:", decoded); // Print user data to console


        next(); // Proceed to the next middleware/route
    } catch (err) {
        console.error("🔴 Invalid Token Error:", err.message);
        return res.status(403).json({ error: "Invalid Token" });
    }
};

// 🔹 Add an Exercise
router.post("/add",async (req, res) => {
  
    // console.log("current user name",req.user.email);
    
    console.log(req.body);
    try {
        
        const { email, type, count, duration, notes } = req.body;
        
        // ✅ Check if user exists
        const userExists = await User.findOne({ email:email });
        if (!userExists) return res.status(404).json({ message: "User not found" });
        // ✅ Calculate Intensity Level Based on Count
        let intensityLevel = "Medium"; // Default
        if (count < 20) {
            intensityLevel = "Low";
        } else if (count > 50) {
            intensityLevel = "High";
        }

        // ✅ Calculate Calories Burned
        const caloriesBurned = Math.round((count * duration) / 10); // Example formula

        // ✅ Save Exercise Data
        const exercise = new Exercise({
            email,
            type,
            count,
            duration,
            intensityLevel,
            caloriesBurned,
            notes,
        });
        console.log(exercise);

        await exercise.save();
        res.status(201).json({ message: "Exercise logged successfully", exercise });

    } catch (error) {
        console.error("❌ Error Saving Exercise:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});


// 🔹 Get Exercises of a User (Sorted by Timestamp)
router.get("/:userId", async (req, res) => {
    try {
        const exercises = await Exercise.find({ userId: req.params.userId }).sort({ timestamp: -1 });
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// 🔹 Get Exercise Details by ID
router.get("/details/:exerciseId", async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.exerciseId);
        if (!exercise) return res.status(404).json({ message: "Exercise not found" });

        res.json(exercise);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// 🔹 Update an Exercise
router.put("/update/:exerciseId", async (req, res) => {
    try {
        const updatedExercise = await Exercise.findByIdAndUpdate(req.params.exerciseId, req.body, { new: true });

        if (!updatedExercise) return res.status(404).json({ message: "Exercise not found" });

        res.json({ message: "Exercise updated successfully", updatedExercise });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// 🔹 Delete an Exercise
router.delete("/:exerciseId", async (req, res) => {
    try {
        const exercise = await Exercise.findByIdAndDelete(req.params.exerciseId);
        if (!exercise) return res.status(404).json({ message: "Exercise not found" });

        res.json({ message: "Exercise deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

export default router;

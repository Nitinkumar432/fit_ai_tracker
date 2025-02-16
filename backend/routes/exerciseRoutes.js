import express from "express";
import Exercise from "../Models/exercisesschema.js";
import User from "../Models/UserSchema.js";
import authenticateUser from "../middleware/authMiddleware.js"; // ✅ Correct default import
import cookieParser from "cookie-parser";

const router = express.Router();

// 🔹 Add an Exercise
router.post("/add", authenticateUser, async (req, res) => {
    console.log(req.body);
    try {
        const { email, type, count, duration, notes } = req.body;
        // ✅ Check if user exists
        const userExists = await User.findOne({ email: email });
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

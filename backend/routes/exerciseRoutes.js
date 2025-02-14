import express from "express";
import Exercise from "../Models/exercisesschema.js";
import User from "../Models/UserSchema.js";

const router = express.Router();

// 🔹 Add an Exercise
router.post("/add", async (req, res) => {
    try {
        const { userId, type, count, duration, intensityLevel, caloriesBurned, notes } = req.body;

      
        const userExists = await User.findById(userId);
        if (!userExists) return res.status(404).json({ message: "User not found" });

        const exercise = new Exercise({
            userId,
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

import express from "express";
import Leaderboard from "../Models/leaderboardSchema.js";
import User from "../Models/UserSchema.js";

const router = express.Router();

// Get full Leaderboard sorted by totalScore
router.get("/", async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find()
            .sort({ totalScore: -1 })
            .populate("userId", "name");

        // Assign rank dynamically
        leaderboard.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// Get User Rank & Stats
router.get("/:userId", async (req, res) => {
    try {
        const userRank = await Leaderboard.findOne({ userId: req.params.userId }).populate("userId", "name");
        if (!userRank) return res.status(404).json({ message: "User not found in leaderboard" });

        // Get current rank dynamically
        const leaderboard = await Leaderboard.find().sort({ totalScore: -1 });
        const rank = leaderboard.findIndex(entry => entry.userId.toString() === req.params.userId) + 1;

        res.json({ ...userRank.toObject(), rank });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// Update Leaderboard Entry (e.g., after a workout)
router.post("/update", async (req, res) => {
    try {
        const { userId, score, bestPerformance, streak } = req.body;

        // Ensure user exists
        const userExists = await User.findById(userId);
        if (!userExists) return res.status(404).json({ message: "User not found" });

        let leaderboardEntry = await Leaderboard.findOne({ userId });

        if (leaderboardEntry) {
            // Update existing entry
            leaderboardEntry.totalScore += score;
            leaderboardEntry.totalWorkouts += 1;
            leaderboardEntry.bestPerformance = Math.max(leaderboardEntry.bestPerformance, bestPerformance);
            leaderboardEntry.streak = streak;
            leaderboardEntry.lastUpdated = Date.now();
            await leaderboardEntry.save();
        } else {
            // Create new entry
            leaderboardEntry = new Leaderboard({ userId, totalScore: score, totalWorkouts: 1, bestPerformance, streak });
            await leaderboardEntry.save();
        }

        res.json({ message: "Leaderboard updated successfully", leaderboardEntry });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

export default router;

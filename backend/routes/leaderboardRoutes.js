import express from "express";
import Exercise from "../models/exercisesschema.js";
import Leaderboard from "../models/leaderboardSchema.js";

const router = express.Router();

// ✅ Function to Calculate Score Based on Exercise Factors
const calculateScore = (exercise) => {
    let baseScore = (exercise.count * 2) + (exercise.duration * 1.5);
    return Math.floor(baseScore);
};

// ✅ Function to Update Leaderboard
const updateLeaderboard = async () => {
    try {
        const userExerciseStats = await Exercise.aggregate([
            {
                $group: {
                    _id: "$email",
                    totalWorkouts: { $sum: 1 },
                    totalCount: { $sum: "$count" },
                    totalDuration: { $sum: "$duration" },
                    lastWorkoutDate: { $max: "$timestamp" }
                }
            }
        ]);

        for (const user of userExerciseStats) {
            const { _id: email, totalWorkouts, totalCount, totalDuration, lastWorkoutDate } = user;
            const exercises = await Exercise.find({ email });
            let finalScore = exercises.reduce((total, exercise) => total + calculateScore(exercise), 0);

            await Leaderboard.findOneAndUpdate(
                { email },
                {
                    email,
                    totalScore: finalScore,
                    totalWorkouts,
                    totalCount,
                    totalDuration,
                    lastUpdated: new Date()
                },
                { upsert: true, new: true }
            );
        }

        console.log("✅ Leaderboard updated successfully!");
    } catch (error) {
        console.error("❌ Error updating leaderboard:", error);
    }
};

// ✅ Fetch Leaderboard Data Sorted by Rank (Descending Order by Score)
router.get("/leaderboarddata", async (req, res) => {
    console.log("Leaderboard data requested. Updating first...");

    try {
        await updateLeaderboard();
        
        const leaderboard = await Leaderboard.find().sort({ totalScore: -1 }); // Descending order

        leaderboard.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        await Promise.all(leaderboard.map(entry => entry.save()));

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/streaks", async (req, res) => {
    try {
      const { email } = req.query;
  
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
  
      // Fetch exercises for the given email, sorted by timestamp
      const exercises = await Exercise.find({ email }).sort({ timestamp: 1 });
  
      if (exercises.length === 0) {
        return res.status(404).json({ error: "No exercise data found for this email" });
      }
  
      // Extract unique workout days (YYYY-MM-DD format)
      const completedDays = new Set();
      exercises.forEach((exercise) => {
        const date = new Date(exercise.timestamp).toISOString().split("T")[0];
        completedDays.add(date); // Add unique workout days
      });
  
      // Convert set to sorted array (YYYY-MM-DD format)
      const uniqueDates = [...completedDays].sort();
  
      let currentStreak = 0;
      let bestStreak = 0;
      let today = new Date().toISOString().split("T")[0];
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday = yesterday.toISOString().split("T")[0];
  
      let lastDate = null;
  
      // Calculate streaks
      uniqueDates.forEach((date) => {
        const currentDate = new Date(date);
  
        if (lastDate) {
          const lastWorkoutDate = new Date(lastDate);
          const diffDays = (currentDate - lastWorkoutDate) / (1000 * 60 * 60 * 24);
  
          if (diffDays === 1) {
            currentStreak += 1; // Increase streak
          } else if (diffDays > 1) {
            bestStreak = Math.max(bestStreak, currentStreak);
            currentStreak = 1; // Reset streak
          }
        } else {
          currentStreak = 1; // First workout day
        }
  
        lastDate = date;
      });
  
      // Ensure best streak is updated
      bestStreak = Math.max(bestStreak, currentStreak);
  
      // Determine active streak
      let activeStreak = 0;
      if (uniqueDates.includes(today)) {
        activeStreak = currentStreak; // Today is part of the streak
      } else if (uniqueDates.includes(yesterday)) {
        activeStreak = currentStreak; // Yesterday was the last workout day
      } else {
        activeStreak = 0; // Streak is broken
      }
  
      // Send response
      res.json({
        activeStreak,
        bestStreak,
        completedDays: uniqueDates, // Sorted unique workout days
      });
    } catch (error) {
      console.error("Error fetching streak data:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
export default router;

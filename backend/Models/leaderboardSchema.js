import mongoose from "mongoose";
const leaderboardSchema = new mongoose.Schema({

    email: { type: String ,required: true, unique: true },
    totalScore: { type: Number, default: 0 },
    rank: { type: Number, default: null }, 
    totalWorkouts: { type: Number, default: 0 },
    bestPerformance: { type: Number, default: 0 }, 
    streak: { type: Number, default: 0 }, 
    lastUpdated: { type: Date, default: Date.now }
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
export default Leaderboard;

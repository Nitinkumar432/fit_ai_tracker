import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import cookieParser from "cookie-parser";
dotenv.config(); // Load environment variables

const app = express();
app.use(cookieParser());
// ✅ Ensure correct middleware order
app.use(cors({ origin: process.env.VITE_URL || "http://localhost:5173", credentials: true }));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));  



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

app.get("/", (req, res) => res.status(200).json({ message: "🚀 API is running!" }));

// API Routes
app.use("/auth", authRoutes);
app.use("/excercise", exerciseRoutes);
app.use("/leaderboard", leaderboardRoutes);

// Handle Undefined Routes
app.use((req, res) => res.status(404).json({ error: "❌ Route not found" }));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Connected to Frontend at: ${process.env.VITE_URL || "http://localhost:5174"}`);
});

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    height: { type: Number }, // in cm
    weight: { type: Number}, // in kg
    fitnessLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    goal: { type: String, enum: ["Weight Loss", "Muscle Gain", "Endurance", "General Fitness"] },
    activityPreferences: [{ type: String }], // e.g., ["Pushups", "Running", "Yoga"]
    workoutHistory: [
        {
            date: { type: Date, default: Date.now },
            activity: String,
            duration: Number, // in minutes
            caloriesBurned: Number
        }
    ],
    streak: { type: Number, default: 0 }, // Consecutive workout days
    lastLogin: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 🔓 Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;

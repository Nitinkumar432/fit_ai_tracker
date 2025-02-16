import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    email: { type: String, required: true },
    type: { type: String, required: true }, // "Pushup", "Squat", "Jump", etc.
    count: { type: Number, default: 0 }, // Repetitions (for exercises like pushups)
    duration: { type: Number, default: 0 }, // in seconds (for time-based exercises)
    intensityLevel: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" }, // Workout intensity
    caloriesBurned: { type: Number, default: 0 }, // Estimated calories burned
    notes: { type: String, default: "" }, // Optional field for workout notes
    timestamp: { type: Date, default: Date.now }
});

// ✅ Prevent Overwriting Model
const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", exerciseSchema);

export default Exercise;

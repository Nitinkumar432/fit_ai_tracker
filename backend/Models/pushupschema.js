const mongoose = require("mongoose");

const pushupSchema = new mongoose.Schema({
  email: { type:String, required: true },
  pushups: { type: Number, required: true },
  time: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Pushup = mongoose.model("Pushup", pushupSchema);
module.exports = Pushup;

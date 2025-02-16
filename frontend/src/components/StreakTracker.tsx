import { useState } from "react";
import { motion } from "framer-motion";
import { format, addDays, subDays } from "date-fns";

const StreakTracker = () => {
  const [startDate, setStartDate] = useState(new Date());
  const today = new Date();

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 max-w-lg mx-auto text-center">
      <div className="flex justify-around items-center mb-4">
        <div className="text-center">
          <span className="text-4xl font-bold text-gray-100">0</span>
          <p className="text-sm text-gray-400">Week Streaks</p>
        </div>
        <div className="text-center">
          <span className="text-4xl font-bold text-gray-100">0</span>
          <p className="text-sm text-gray-400">Best Streaks</p>
        </div>
      </div>
      
      <p className="text-lg font-semibold mb-2 text-gray-200">This Week</p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStartDate(subDays(startDate, 7))}
          className="text-gray-300 hover:text-gray-100 transition-colors"
        >
          <span className="text-[32px] p-3">&#8249;</span>
        </button>
        <div className="flex gap-3">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors ${
                format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd") 
                  ? "border-red-400 text-red-400" 
                  : "border-gray-600 text-gray-400"
              }`}
            >
              {format(day, "d")}
            </div>
          ))}
        </div>
        <button
          onClick={() => setStartDate(addDays(startDate, 7))}
          className="text-gray-300 hover:text-gray-100 transition-colors"
        >
          <span className="text-[32px] p-3">&#8250;</span>
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Exercise at least 3 times a week to keep your streak not reset
      </p>
      <button className="bg-gradient-to-r from-purple-400 to-cyan-400 text-gray-900 px-4 py-2 rounded-lg mt-4 font-semibold hover:opacity-90 transition-opacity">
        Today's Routine
      </button>
    </div>
  );
};

export default StreakTracker;

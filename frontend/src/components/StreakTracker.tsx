import { useState } from "react";
import { motion } from "framer-motion";
import { format, addDays, subDays } from "date-fns";

const StreakTracker = () => {
  const [startDate, setStartDate] = useState(new Date());
  const today = new Date();

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto text-center">
      <div className="flex justify-around items-center mb-4">
        <div className="text-center">
          <span className="text-4xl font-bold">0</span>
          <p className="text-sm text-gray-500">Week Streaks</p>
        </div>
        <div className="text-center">
          <span className="text-4xl font-bold">0</span>
          <p className="text-sm text-gray-500">Best Streaks</p>
        </div>
      </div>
      
      <p className="text-lg font-semibold mb-2">This Week</p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStartDate(subDays(startDate, 7))}
          className="text-xl p-3"
        >
            <span className="text-[32px] p-3">&#8249;</span>
          
        </button>
        <div className="flex gap-3">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd") ? "border-red-500 text-red-500" : "border-gray-300 text-gray-500"
              }`}
            >
              {format(day, "d")}
            </div>
          ))}
        </div>
        <button
          onClick={() => setStartDate(addDays(startDate, 7))}
          className="text-lg p-3"
        >
          <span className="text-[32px] p-3">&#8250;</span>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Exercise at least 3 times a week to keep your streak not reset
      </p>
      <button className="bg-black text-white px-4 py-2 rounded-lg mt-3">
        Today's Routine
      </button>
    </div>
  );
};

export default StreakTracker;

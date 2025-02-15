import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const exercises = [
  { name: "Jumping Jacks", gif: "YOUR_GIPHY_URL_HERE" },
  { name: "Plank", gif: "YOUR_GIPHY_URL_HERE" },
  { name: "Squats", gif: "YOUR_GIPHY_URL_HERE" },
  { name: "Push-ups", gif: "YOUR_GIPHY_URL_HERE" },
];

const MasterMoves = () => {
  const [index, setIndex] = useState(0);

  const prevExercise = () => {
    setIndex((prev) => (prev === 0 ? exercises.length - 1 : prev - 1));
  };

  const nextExercise = () => {
    setIndex((prev) => (prev === exercises.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto text-center">
      <h2 className="text-xl font-semibold mb-4">Master the moves</h2>
      <div className="flex items-center justify-between">
        <button onClick={prevExercise} className="text-gray-500 p-2">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-6">
          <motion.div className="w-40 h-40 rounded-lg shadow-md flex flex-col items-center justify-center bg-gray-100">
            <img src={exercises[index].gif} alt={exercises[index].name} className="w-32 h-32 object-cover" />
            <p className="font-bold mt-2">{exercises[index].name}</p>
          </motion.div>
        </div>
        <button onClick={nextExercise} className="text-gray-500 p-2">
          <ChevronRight size={24} />
        </button>
      </div>
      <p className="text-gray-600 mt-4">
        Learning how to move correctly would significantly increase your efficiency.
        We have some good tips for you, check it out!
      </p>
      <button className="bg-black text-white px-4 py-2 rounded-lg mt-3">
        Start Learning
      </button>
    </div>
  );
};

export default MasterMoves;

import { useState } from "react";
import { motion } from "framer-motion";
import { Medal, ChevronLeft, ChevronRight } from "lucide-react";

const users = [
  { name: "Alice", activity: 120, avatar: "https://via.placeholder.com/50" },
  { name: "Bob", activity: 100, avatar: "https://via.placeholder.com/50" },
  { name: "Charlie", activity: 90, avatar: "https://via.placeholder.com/50" },
  { name: "David", activity: 80, avatar: "https://via.placeholder.com/50" },
  { name: "Eve", activity: 70, avatar: "https://via.placeholder.com/50" },
];

const WallOfFame = () => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 3;

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % (users.length - itemsPerPage + 1));
  };
  
  const prevSlide = () => {
    setStartIndex((prev) => (prev - 1 + (users.length - itemsPerPage + 1)) % (users.length - itemsPerPage + 1));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">Wall of Fame</h2>
      <div className="flex justify-between items-center">
        <button onClick={prevSlide} className="text-xl">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-4">
          {users.slice(startIndex, startIndex + itemsPerPage).map((user, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md"
              whileHover={{ scale: 1.1 }}
            >
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mb-2" />
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.activity} Points</p>
              <Medal className="text-yellow-500 mt-1" />
            </motion.div>
          ))}
        </div>
        <button onClick={nextSlide} className="text-xl">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <p className="text-gray-500 text-sm mt-3">Keep up with your exercise plan to earn new surprises</p>
      <button className="bg-black text-white px-4 py-2 rounded-lg mt-3">View All</button>
    </div>
  );
};

export default WallOfFame;

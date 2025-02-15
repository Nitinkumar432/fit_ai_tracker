import { motion } from "framer-motion";

const UserLevelCard = () => {
  return (
    <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto">
      {/* User Avatar */}
      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-semibold text-gray-600">
        P
      </div>

      {/* User Info */}
      <div className="flex-1">
        <h1 className="text-xl font-bold">Hi, Pratyush Kumar!</h1>
        <p className="text-sm font-semibold text-gray-500">Level 1</p>
        
        {/* Progress Bar */}
        <div className="mt-2 relative">
          <motion.div 
            initial={{ width: "0%" }} 
            animate={{ width: "0%" }} 
            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full" 
            style={{ width: "0%" }}
          ></motion.div>
          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-0" />
          </div>
          <p className="text-xs text-center mt-1 text-gray-500">0 / 150</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">Earn 150 points to level up</p>
      </div>
    </div>
  );
};

export default UserLevelCard;

"use client"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Home, Dumbbell, Book, User, LogOut } from "lucide-react"
import UserLevelCard from "./UserLevelCard"
import StreakTracker from "./StreakTracker"
import MasterMoves from "./MasterMoves"
import WallOfFame from "./WallOfFame"
import Record from "./Record"

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/auth")
  }

  const sidebarItems = [
    { icon: Home, text: "Dashboard", active: true },
    { icon: Dumbbell, text: "Training" },
    { icon: Book, text: "Learning" },
    { icon: User, text: "Profile" },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed left-0 max-h-auto w-64 bg-white/80 backdrop-blur-lg shadow-xl border-r border-gray-200 z-10"
      >
        <div className="flex flex-col h-full p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

          <nav className="flex-1">
            <ul className="space-y-2">
              {sidebarItems.map((item, index) => (
                <motion.li
                  key={item.text}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-lg transition-all 
                      ${
                        item.active
                          ? "text-blue-600 bg-blue-100 shadow-md"
                          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      }`}
                  >
                    <item.icon className="w-6 h-6 mr-3" />
                    <span className="font-semibold">{item.text}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-white text-lg font-medium bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content with Sidebar Spacing */}
      <div className="flex-1 ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-10 max-w-7xl mx-auto"
        >
          {/* User Card */}
          <motion.div
            className="mb-8 bg-white shadow-lg rounded-xl p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <UserLevelCard />
          </motion.div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              className="bg-white shadow-lg rounded-xl p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StreakTracker />
            </motion.div>
            <motion.div
              className="bg-white shadow-lg rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <WallOfFame />
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              className="bg-white shadow-lg rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MasterMoves />
            </motion.div>
            <motion.div
              className="bg-white shadow-lg rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Record />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Home, Dumbbell, Book, User, LogOut, Menu, X } from "lucide-react"
import UserLevelCard from "./UserLevelCard"
import StreakTracker from "./StreakTracker"
import MasterMoves from "./MasterMoves"
import WallOfFame from "./WallOfFame"
import Record from "./Record"

export default function Dashboard() {
  const navigate = useNavigate()
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [userProfile, setUserProfile] = useState(null)

  const backendUrl = "http://localhost:5000"

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${backendUrl}/auth/profile`, {
        method: "GET",
        credentials: "include", // Include cookies in the request
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile data")
      }

      const data = await response.json()
      setUserProfile(data)
    } catch (error) {
      console.error("Error fetching profile data:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/auth")
  }

  const sidebarItems = [
    { icon: Home, text: "Dashboard", path: "/dashboard" },
    { icon: Dumbbell, text: "Training", path: "/training" },
    { icon: Book, text: "Learning", path: "/learning" },
    { icon: User, text: "Profile", path: "/profile" },
  ]

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6 bg-black border-r bg-black">
      <h2 className="text-2xl font-bold text-gray-200 mb-6">Dashboard</h2>

      <nav className="flex-1">
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => (
            <motion.li key={item.text}>
              <button
                onClick={() => {
                  navigate(item.path)
                  setCurrentPath(item.path)
                  if (isMobile) setSidebarOpen(false)
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-lg transition-all 
                  ${
                    currentPath === item.path
                      ? "text-cyan-400 bg-black shadow-md"
                      : "text-gray-400 hover:bg-gray-800 hover:text-cyan-300"
                  }`}
              >
                <item.icon className="w-6 h-6 mr-3" />
                <span className="font-semibold">{item.text}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>

      <motion.button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-white text-lg font-medium bg-red-700 rounded-lg hover:bg-red-600 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </motion.button>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-black from-gray-900 to-gray-800">
      {/* Mobile Menu Button */}
      <button onClick={toggleSidebar} className="fixed top-4 left-4 z-50 lg:hidden bg-gray-800 p-2 rounded-lg shadow-md">
        {sidebarOpen ? <X className="w-6 h-6 text-gray-200" /> : <Menu className="w-6 h-6 text-gray-200" />}
      </button>

      {/* Sidebar for larger screens */}
      <motion.div
        className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-gray-900/90 backdrop-blur-lg shadow-xl border-r border-gray-700 z-40"
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-gray-900/80 z-40 lg:hidden"
          >
            <motion.div
              className="fixed left-0 top-0 h-full w-64 bg-gray-900 shadow-xl z-50 border-r border-gray-700"
            >
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 lg:ml-64">
        <motion.div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* User Card */}
          <motion.div className="mb-8 bg-gray-800 shadow-xl rounded-xl p-6">
            <UserLevelCard userProfile={userProfile} />
          </motion.div>
          
          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div className="bg-gray-800 shadow-xl rounded-xl p-6">
              <StreakTracker />
            </motion.div>
            <motion.div className="bg-gray-800 shadow-xl rounded-xl p-6">
              <WallOfFame />
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div className="bg-gray-800 shadow-xl rounded-xl p-6">
              <MasterMoves />
            </motion.div>
            <motion.div className="bg-gray-800 shadow-xl rounded-xl p-6">
              <Record />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
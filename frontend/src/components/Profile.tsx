"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Home, Dumbbell, Book, User, LogOut, Menu, X } from "lucide-react"

export default function Profile() {
  const navigate = useNavigate()
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const userData = {
    name: "P",
    lexel: "0 / 150",
    birthday: "February 15, 2005",
    goal: "Lose Weight & Burn Fat",
    intensity: "Quite intense",
    exerciseDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    history: []
  };

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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6 bg-black border-r bg-black">
      <h2 className="text-2xl font-bold text-gray-200 mb-6">Dashboard</h2>

      <nav className="flex-1">
        <ul className="space-y-2">
          {[
            { icon: Home, text: "Dashboard", path: "/dashboard" },
            { icon: Dumbbell, text: "Training", path: "/training" },
            { icon: Book, text: "Learning", path: "/learning" },
            { icon: User, text: "Profile", path: "/profile" },
          ].map((item) => (
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
                      ? "text-cyan-400 bg-gray-700"
                      : "text-gray-400 hover:bg-gray-700 hover:text-cyan-300"
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
        onClick={() => {
          localStorage.removeItem("token")
          navigate("/auth")
        }}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-white text-lg font-medium bg-red-600 rounded-lg hover:bg-red-700 transition-all mt-4"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </motion.button>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-black">
      {/* Mobile Menu Button */}
      <button onClick={toggleSidebar} className="fixed top-4 left-4 z-50 lg:hidden bg-black p-2 rounded-lg shadow-md">
        {sidebarOpen ? <X className="w-6 h-6 text-gray-200" /> : <Menu className="w-6 h-6 text-gray-200" />}
      </button>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-gray-800/90 backdrop-blur-lg shadow-xl border-r border-gray-700 z-40"
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 bg-gray-900/80 z-40 lg:hidden"
            onClick={toggleSidebar}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed left-0 top-0 h-full w-64 bg-gray-800 shadow-xl z-50 border-r border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Content */}
      <div className="flex-1 transition-all duration-300 lg:ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-10 max-w-7xl mx-auto space-y-8"
        >
          {/* Profile Header */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h1 className="text-4xl font-bold text-cyan-400 mb-4">{userData.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Lexel</p>
                <p className="text-2xl font-bold text-gray-100">{userData.lexel}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Birthday</p>
                <p className="text-xl text-gray-100">{userData.birthday}</p>
              </div>
            </div>
          </div>

          {/* Goals & Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Primary Goal</h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-100 text-lg">{userData.goal}</p>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Exercise Plan</h2>
              <div className="bg-gray-700 p-4 rounded-lg space-y-2">
                <p className="text-gray-100">
                  <span className="text-gray-400">Intensity:</span> {userData.intensity}
                </p>
                <p className="text-gray-100">
                  <span className="text-gray-400">Days:</span> {userData.exerciseDays.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Activity History</h2>
            <div className="bg-gray-700 p-4 rounded-lg min-h-[200px] flex items-center justify-center">
              {userData.history.length === 0 ? (
                <p className="text-gray-400 text-lg">No history to show...</p>
              ) : (
                <div className="text-gray-100">History items will appear here</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
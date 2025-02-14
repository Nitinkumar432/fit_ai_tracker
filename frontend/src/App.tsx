import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import PushupCounter from './components/PushupCounter'
import ShoulderTapCounter from './components/ShoulderTapCounter'
import SquatCounter from "./components/SquatsCount";
import PlankTimer from "./components/PlankTimer";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/pushups" element={<PushupCounter />} />
        <Route path="/shoulder-taps" element={<ShoulderTapCounter />} />
        <Route path="/squats" element={<SquatCounter/>} />
        <Route path="/plank" element={<PlankTimer />} />
      </Routes>
    </Router>
  )
}

export default App

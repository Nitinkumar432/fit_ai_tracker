import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import PushupCounter from './components/PushupCounter'
import ShoulderTapCounter from './components/ShoulderTapCounter'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/pushups" element={<PushupCounter />} />
        <Route path="/shoulder-taps" element={<ShoulderTapCounter />} />
      </Routes>
    </Router>
  )
}

export default App

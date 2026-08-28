import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AssignmentPage from './pages/AssignmentPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/courses" element={<AssignmentPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/header/Header'
import LandingPage from './components/landing_page/LandingPage'
import Notices from './components/notices/Notices'
import Footer from './components/footer/Footer'

function App() {
  return (
    <BrowserRouter>
      <main className="landing-page">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/notices" element={<Notices />} />
        </Routes>
        <Footer />
      </main>
    </BrowserRouter>
  )
}

export default App

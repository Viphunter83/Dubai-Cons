import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Clients from './pages/Clients'
import Design from './pages/Design'
import Estimation from './pages/Estimation'

import FloatingDock from './components/FloatingDock'

function App() {
  return (
    <Router>
      <div className="app">
        {/* Removed Top Header */}

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/design" element={<Design />} />
            <Route path="/estimation" element={<Estimation />} />
          </Routes>
        </main>

        <FloatingDock />
      </div>
    </Router>
  )
}

export default App

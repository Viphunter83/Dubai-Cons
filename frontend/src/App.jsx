import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Clients from './pages/Clients'
import Design from './pages/Design'
import Estimation from './pages/Estimation'

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <h1>Dubai Cons AI Suite</h1>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/clients">Clients</Link>
              <Link to="/design">Design</Link>
              <Link to="/estimation">Estimation</Link>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/design" element={<Design />} />
            <Route path="/estimation" element={<Estimation />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>&copy; 2025 Dubai Cons - AI Suite MVP</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App

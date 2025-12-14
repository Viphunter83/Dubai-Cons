import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Clients from './pages/Clients'
import Design from './pages/Design'
import Estimation from './pages/Estimation'

import FloatingDock from './components/FloatingDock';
import ProjectDetails from './pages/ProjectDetails';

function App() {
  return (
    <Router>
      <div className="app">
        <FloatingDock />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/design" element={<Design />} />
            <Route path="/estimation" element={<Estimation />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/clients" element={<Clients />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App

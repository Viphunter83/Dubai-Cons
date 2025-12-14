import React from 'react'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <div className="container">
        <div className="hero">
          <h1>Welcome to Dubai Cons AI Suite</h1>
          <p className="subtitle">Professional AI-powered architectural design and visualization</p>
        </div>

        <div className="features">
          <div className="feature-card">
            <h3>🏗️ Project Management</h3>
            <p>Manage your construction projects efficiently with our AI-powered tools</p>
          </div>
          
          <div className="feature-card">
            <h3>🎨 AI Design Generation</h3>
            <p>Generate stunning design concepts using advanced AI technology</p>
          </div>
          
          <div className="feature-card">
            <h3>👥 Client Management</h3>
            <p>Keep track of all your clients and their preferences</p>
          </div>
          
          <div className="feature-card">
            <h3>🎯 3D Visualization</h3>
            <p>Visualize your designs in realistic 3D before construction</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">100+</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">50+</div>
            <div className="stat-label">Clients</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">95%</div>
            <div className="stat-label">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

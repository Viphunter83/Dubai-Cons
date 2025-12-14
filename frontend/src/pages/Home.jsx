import React from 'react'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <div className="container">
        <div className="hero">
          <h1 className="text-gradient-gold">Welcome to Dubai Cons AI Suite</h1>
          <p className="subtitle">Professional AI-powered architectural design and visualization</p>
        </div>

        <div className="features">
          <div className="feature-card glass-card">
            <h3>🏗️ Project Management</h3>
            <p>Manage your construction projects efficiently with our AI-powered tools</p>
          </div>

          <div className="feature-card glass-card">
            <h3>🎨 AI Design Generation</h3>
            <p>Generate stunning design concepts using advanced AI technology</p>
          </div>

          <div className="feature-card glass-card">
            <h3>👥 Client Management</h3>
            <p>Keep track of all your clients and their preferences</p>
          </div>

          <div className="feature-card glass-card">
            <h3>🎯 3D Visualization</h3>
            <p>Visualize your designs in realistic 3D before construction</p>
          </div>
        </div>

        <div className="process-flow" style={{
          margin: '4rem 0',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'var(--accent-gold)', marginBottom: '2rem' }}>🚀 How It Works</h2>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <div className="process-step glass-card" style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>1️⃣</div>
              <h3 style={{ color: '#fff' }}>Define</h3>
              <p>Choose presets or describe your vision in text.</p>
            </div>
            <div className="process-step glass-card" style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>2️⃣</div>
              <h3 style={{ color: '#fff' }}>Generate</h3>
              <p>AI creates visual concepts and 3D models.</p>
            </div>
            <div className="process-step glass-card" style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>3️⃣</div>
              <h3 style={{ color: '#fff' }}>Validate</h3>
              <p>Check compliance with Dubai building codes.</p>
            </div>
            <div className="process-step glass-card" style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>4️⃣</div>
              <h3 style={{ color: '#fff' }}>Estimate</h3>
              <p>Get real-time cost estimation for fit-out.</p>
            </div>
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

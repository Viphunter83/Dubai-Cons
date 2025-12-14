import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../config'
import { useNavigate } from 'react-router-dom'
import './Projects.css'

function Projects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    location: "Dubai Marina",
    property_type: "Apartment",
    area: 120,
    budget: 500000,
    description: "New AI Project"
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/projects/`)
      setProjects(response.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${config.apiBaseUrl}/projects/`, newProject)
      setShowModal(false)
      fetchProjects()
      // Optional: auto-navigate to it
      navigate(`/projects/${res.data.id}`)
    } catch (error) {
      alert("Failed to create project")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProject(prev => ({
      ...prev,
      [name]: name === 'area' || name === 'budget' ? parseFloat(value) : value
    }))
  }

  if (loading) {
    return <div className="loading">Loading projects...</div>
  }

  return (
    <div className="projects">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="text-gradient-gold" style={{ marginBottom: 0 }}>Projects</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Project</button>
        </div>

        <div className="projects-grid">
          {projects.map(project => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => navigate(`/projects/${project.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-details">
                <span className="badge">{project.property_type || 'Custom'}</span>
                <span className="area">{project.area} sqm</span>
                <span className="status">{project.status}</span>
              </div>
              <div className="project-footer">
                <span className="location">📍 {project.location}</span>
                <span className="budget">${project.budget?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="empty-state">
            <p>No projects yet. Create your first project!</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Create Now</button>
          </div>
        )}

        {/* Simple Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Create New Project</h2>
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label>Title</label>
                  <input name="title" value={newProject.title} onChange={handleInputChange} required placeholder="e.g. Villa Palm Jumeirah" />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select name="property_type" value={newProject.property_type} onChange={handleInputChange}>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Area (sqm)</label>
                    <input type="number" name="area" value={newProject.area} onChange={handleInputChange} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Budget (AED)</label>
                    <input type="number" name="budget" value={newProject.budget} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input name="location" value={newProject.location} onChange={handleInputChange} required />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Project</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Projects

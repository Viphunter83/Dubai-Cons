import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../config'
import './Projects.css'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <div className="loading">Loading projects...</div>
  }

  return (
    <div className="projects">
      <div className="container">
        <h1>Projects</h1>

        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-details">
                <span className="badge">{project.property_type}</span>
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
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects

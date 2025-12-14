import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import config from '../config'
import './Estimation.css'

function Estimation() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [estimation, setEstimation] = useState(null)
  const [audit, setAudit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [auditLoading, setAuditLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/projects/`)
      setProjects(response.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const calculateEstimation = async (projectId) => {
    setLoading(true)
    setError(null)
    setAudit(null)

    try {
      const response = await axios.post(`${config.apiBaseUrl}/estimation/calculate/${projectId}`)
      setEstimation(response.data)
      setSelectedProject(projectId)
    } catch (error) {
      console.error('Error calculating estimation:', error)
      setError('Ошибка при расчете стоимости')
    } finally {
      setLoading(false)
    }
  }

  const getEstimation = async (projectId) => {
    setLoading(true)
    setError(null)
    setAudit(null)

    try {
      const response = await axios.get(`${config.apiBaseUrl}/estimation/project/${projectId}`)
      setEstimation(response.data)
      setSelectedProject(projectId)
    } catch (error) {
      // 404 is nice now
      console.log('No estimation found')
      setEstimation(null)
      setSelectedProject(projectId)
    } finally {
      setLoading(false)
    }
  }

  const runAiAudit = async () => {
    if (!selectedProject) return
    setAuditLoading(true)
    try {
      const res = await axios.post(`${config.apiBaseUrl}/estimation/audit/${selectedProject}`)
      setAudit(res.data)
    } catch (e) {
      alert("AI Audit failed: " + e.message)
    } finally {
      setAuditLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="estimation">
      <div className="container">
        <h1 className="text-gradient-gold">Construction Cost Estimation</h1>

        <div className="estimation-controls">
          <div className="project-selector">
            <h3>Select Project:</h3>
            <div className="project-list">
              {projects.map(project => (
                <div
                  key={project.id}
                  className={`project-card ${selectedProject === project.id ? 'active-project' : ''}`}
                >
                  <h4>{project.title}</h4>
                  <div className="project-meta">
                    <p>Area: {project.area} sqm</p>
                    <p>Type: {project.property_type || 'N/A'}</p>
                  </div>

                  <div className="project-actions">
                    <button
                      className="btn btn-primary notranslate"
                      translate="no"
                      onClick={() => calculateEstimation(project.id)}
                      disabled={loading}
                    >
                      {loading ? 'Calculating...' : '⚡ Calculate Cost'}
                    </button>
                    <button
                      className="btn btn-secondary notranslate"
                      translate="no"
                      onClick={() => getEstimation(project.id)}
                      disabled={loading}
                    >
                      Show Estimate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State / Not Found */}
        {!estimation && selectedProject && !loading && (
          <div className="empty-state">
            <h3>📉 No Estimation Found</h3>
            <p>This project hasn't been estimated yet. Click <strong>⚡ Calculate Cost</strong> to generate an initial quote based on tier-based logic.</p>
          </div>
        )}

        {/* Results */}
        {estimation && (
          <div className="estimation-result">
            <div className="result-header">
              <h2>Project Estimation</h2>
              <button
                className="btn btn-outline-primary ai-audit-btn"
                onClick={runAiAudit}
                disabled={auditLoading}
              >
                {auditLoading ? 'AI Analyzing...' : '✨ AI Audit & Refine'}
              </button>
            </div>

            {audit && (
              <div className="ai-audit-card">
                <h3>🤖 Gemini AI Audit Report</h3>
                <div className="audit-content">
                  <div className="audit-insight">
                    <strong>Expert Insight:</strong>
                    <p>{audit.expert_insight}</p>
                  </div>
                  <div className="audit-risks">
                    <strong>Hidden Risks Detected:</strong>
                    <ul>
                      {audit.risk_factors.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                  <div className="audit-adjustment">
                    <div className="label">Recommended Contingency Buffer:</div>
                    <div className="value text-gradient-gold">+{audit.buffer_percent}% ({formatCurrency(audit.buffer_amount)})</div>
                  </div>
                </div>
              </div>
            )}

            <div className="estimation-summary">
              <div className="summary-card total">
                <h3>Total Cost {audit ? '(Pre-Audit)' : ''}</h3>
                <p className="amount text-gradient-gold">{formatCurrency(estimation.total_cost)}</p>
                {audit && (
                  <div className="audit-total">
                    <span>AI Adjusted Total:</span>
                    <strong style={{ color: '#00f2ea', fontSize: '1.4rem' }}>{formatCurrency(audit.adjusted_total)}</strong>
                  </div>
                )}
              </div>
              <div className="summary-card">
                <h3>Materials</h3>
                <p className="amount">{formatCurrency(estimation.materials_cost)}</p>
              </div>
              <div className="summary-card">
                <h3>Labor</h3>
                <p className="amount">{formatCurrency(estimation.labor_cost)}</p>
              </div>
              <div className="summary-card">
                <h3>Furniture</h3>
                <p className="amount">{formatCurrency(estimation.furniture_cost || 0)}</p>
              </div>
            </div>

            {estimation.breakdown && (
              <div className="estimation-breakdown">
                <h3>Detailed Breakdown</h3>
                <div className="category-grid">
                  {/* Simplified grid for brevity, logic remains same */}
                  <div className="category-item"><span>Flooring</span><span>{formatCurrency(estimation.flooring_cost)}</span></div>
                  <div className="category-item"><span>Walls</span><span>{formatCurrency(estimation.wall_cost)}</span></div>
                  <div className="category-item"><span>Ceiling</span><span>{formatCurrency(estimation.ceiling_cost)}</span></div>
                  <div className="category-item"><span>MEP</span><span>{formatCurrency(estimation.electrical_cost + estimation.plumbing_cost + estimation.hvac_cost)}</span></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Estimation

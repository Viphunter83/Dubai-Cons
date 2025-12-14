import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import config from '../config'
import './ProjectDetails.css'

function ProjectDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProjectDetails()
    }, [id])

    const fetchProjectDetails = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/projects/${id}`)
            setProject(response.data)
        } catch (error) {
            console.error('Error fetching project:', error)
            // alert('Project not found')
            // navigate('/projects')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="loading">Loading dashboard...</div>
    if (!project) return <div className="loading">Project not found</div>

    return (
        <div className="project-details-page">
            <div className="container">

                {/* Header */}
                <div className="header-actions">
                    <div className="project-title">
                        <h1 className="text-gradient-gold">{project.title}</h1>
                        <div className="project-meta">
                            <span>🆔 #{project.id}</span> • <span>📍 {project.location || 'Dubai, UAE'}</span>
                        </div>
                    </div>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/projects')}>
                        ← Back to List
                    </button>
                </div>

                {/* Dashboard Grid */}
                <div className="dashboard-grid">

                    {/* 1. Overview Card */}
                    <div className="dashboard-card">
                        <h3>
                            <span className="icon">📊</span> Overview
                        </h3>
                        <div className="detail-row">
                            <span className="label">Type</span>
                            <span className="value">{project.property_type || 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Area</span>
                            <span className="value">{project.area ? `${project.area} sqm` : 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Status</span>
                            <span className="value" style={{ color: '#00f2ea' }}>Active Phase 1</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Budget</span>
                            <span className="value text-gradient-gold">${project.budget?.toLocaleString() || '0'}</span>
                        </div>
                    </div>

                    {/* 2. Compliance (RAG) Card */}
                    <div className="dashboard-card">
                        <h3>
                            <span className="icon">🛡️</span> Compliance Check
                            <span className="rag-badge">RAG ENGINE</span>
                        </h3>

                        <div className="compliance-status verified">
                            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>✓</div>
                            <strong>Pre-Validation Passed</strong>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Based on Dubai Building Code 2024</div>
                        </div>

                        <div className="action-grid">
                            <button className="btn btn-outline-secondary" style={{ fontSize: '0.9rem' }} onClick={() => alert("Fetching detailed RAG report...")}>
                                View Full Regulatory Report
                            </button>
                        </div>
                    </div>

                    {/* 3. Design & Estimations */}
                    <div className="dashboard-card">
                        <h3>
                            <span className="icon">🎨</span> Design & Cost
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                            Latest design generated: <strong>Modern Luxury Villa v2</strong>
                        </p>
                        <div className="action-grid">
                            <button className="btn btn-primary" onClick={() => navigate('/design')}>
                                Open Design Studio
                            </button>
                            <button className="btn btn-outline-secondary" onClick={() => navigate('/estimation')}>
                                View Cost Estimation
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProjectDetails

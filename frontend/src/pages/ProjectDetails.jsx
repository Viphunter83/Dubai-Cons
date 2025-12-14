import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import config from '../config'
import './ProjectDetails.css'

function ProjectDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [project, setProject] = useState(null)
    const [design, setDesign] = useState(null)
    const [estimation, setEstimation] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [id])

    const loadData = async () => {
        setLoading(true)
        try {
            // 1. Fetch Project
            const pRes = await axios.get(`${config.apiBaseUrl}/projects/${id}`)
            setProject(pRes.data)

            // 2. Fetch Design (Latest)
            try {
                const dRes = await axios.get(`${config.apiBaseUrl}/design/project/${id}`)
                setDesign(dRes.data)
            } catch (e) {
                console.log("No design found")
            }

            // 3. Fetch Estimation
            try {
                const eRes = await axios.get(`${config.apiBaseUrl}/estimation/project/${id}`)
                setEstimation(eRes.data)
            } catch (e) {
                console.log("No estimate found")
            }

        } catch (e) {
            console.error("Error loading project data", e)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="loading">Loading Wizard...</div>
    if (!project) return <div className="loading">Project not found</div>

    // Wizard Steps Logic
    const getStepStatus = (step) => {
        if (step === 1) return design ? 'completed' : 'active'
        if (step === 2) return design ? (design.compliance_report ? 'completed' : 'active') : 'locked' // Compliance
        if (step === 3) return estimation ? 'completed' : (design ? 'active' : 'locked')
        return 'locked'
    }

    return (
        <div className="project-details-page">
            <div className="container">

                {/* Header */}
                <div className="header-actions">
                    <div>
                        <button className="btn btn-sm btn-outline-secondary mb-3" onClick={() => navigate('/projects')}>← Back</button>
                        <h1 className="text-gradient-gold">Project Dashboard</h1>
                        <p className="project-meta-large">{project.title} • {project.location}</p>
                    </div>
                    <div className="status-pill">
                        {project.status.toUpperCase()}
                    </div>
                </div>

                {/* Wizard Overview */}
                <div className="wizard-container">
                    <div className="wizard-line"></div>

                    {/* Step 1: Design */}
                    <div className={`wizard-step ${getStepStatus(1)}`}>
                        <div className="step-circle">1</div>
                        <div className="step-content">
                            <h3>Design Concept</h3>
                            {design ? (
                                <div className="step-done">
                                    <p>✅ Generated <br /><small>{new Date(design.created_at || Date.now()).toLocaleDateString()}</small></p>
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/design?projectId=${id}`)}>View / Edit</button>
                                </div>
                            ) : (
                                <div className="step-todo">
                                    <p>Not started</p>
                                    <button className="btn btn-primary pulse-btn" onClick={() => navigate(`/design?projectId=${id}`)}>Start Design</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 2: Compliance */}
                    <div className={`wizard-step ${getStepStatus(2)}`}>
                        <div className="step-circle">2</div>
                        <div className="step-content">
                            <h3>AI Regulation Check</h3>
                            {design ? (
                                <div className="step-done">
                                    <p>✨ RAG Ready</p>
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => alert("Checking compliance (Simulated for MVP)...")}>Check Again</button>
                                </div>
                            ) : (
                                <div className="step-locked">
                                    <p>Requires Step 1</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 3: Estimation */}
                    <div className={`wizard-step ${getStepStatus(3)}`}>
                        <div className="step-circle">3</div>
                        <div className="step-content">
                            <h3>Cost Estimation</h3>
                            {estimation ? (
                                <div className="step-done">
                                    <button className="btn btn-primary" onClick={() => navigate(`/design?projectId=${project.id}`)}>
                                        Open Design Studio
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={async () => {
                                            try {
                                                const res = await axios.get(`${config.apiBaseUrl}/reports/project/${project.id}/master`, { responseType: 'blob' })
                                                const url = window.URL.createObjectURL(new Blob([res.data]));
                                                const link = document.createElement('a');
                                                link.href = url;
                                                link.setAttribute('download', `MasterReport_${project.title}.pdf`);
                                                document.body.appendChild(link);
                                                link.click();
                                            } catch (e) {
                                                alert("Failed to download Master Report: " + e.message)
                                            }
                                        }}
                                    >
                                        📄 Download Master PDF
                                    </button>
                                    <button className="btn btn-outline-secondary" onClick={() => navigate('/estimation')}>
                                        View Cost Estimation
                                    </button>                  </div>
                            ) : (
                                <div className={getStepStatus(3) === 'locked' ? 'step-locked' : 'step-todo'}>
                                    {getStepStatus(3) === 'locked' ? <p>Requires Design</p> : (
                                        <button className="btn btn-primary" onClick={() => navigate(`/estimation`)}>Calculate</button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Detailed Info Grid */}
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>Project Specs</h3>
                        <div className="detail-row"><span className="label">Type</span><span>{project.property_type}</span></div>
                        <div className="detail-row"><span className="label">Area</span><span>{project.area} sqm</span></div>
                        <div className="detail-row"><span className="label">Budget</span><span>${project.budget?.toLocaleString()}</span></div>
                    </div>

                    {design && design.image_url && (
                        <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
                            <h3>Latest Render</h3>
                            <img src={design.image_url} alt="Render" style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }} />
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default ProjectDetails

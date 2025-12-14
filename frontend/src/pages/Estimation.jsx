import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import config from '../config'
import './Estimation.css'

function Estimation() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [estimation, setEstimation] = useState(null)
  const [loading, setLoading] = useState(false)
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

    try {
      const response = await axios.get(`${config.apiBaseUrl}/estimation/project/${projectId}`)
      setEstimation(response.data)
      setSelectedProject(projectId)
    } catch (error) {
      console.error('Error fetching estimation:', error)
      setError('Оценка не найдена для этого проекта')
    } finally {
      setLoading(false)
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
        <h1>Расчет Стоимости Проекта</h1>

        <div className="estimation-controls">
          <div className="project-selector">
            <h3>Выберите проект:</h3>
            <div className="project-list">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <h4>{project.title}</h4>
                  <p>Тип: {project.property_type || 'N/A'}</p>
                  <p>Площадь: {project.area} кв.м</p>
                  <p>Бюджет: {project.budget ? formatCurrency(project.budget) : 'N/A'}</p>
                  <div className="project-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => calculateEstimation(project.id)}
                      disabled={loading}
                    >
                      {loading ? 'Расчет...' : 'Рассчитать стоимость'}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => getEstimation(project.id)}
                      disabled={loading}
                    >
                      Показать оценку
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}

        {estimation && (
          <div className="estimation-result">
            <h2>Смета Проекта</h2>
            <div className="estimation-summary">
              <div className="summary-card total">
                <h3>Общая стоимость</h3>
                <p className="amount">{formatCurrency(estimation.total_cost)}</p>
              </div>
              <div className="summary-card">
                <h3>Материалы</h3>
                <p className="amount">{formatCurrency(estimation.materials_cost)}</p>
                <p className="percentage">({((estimation.materials_cost / estimation.total_cost) * 100).toFixed(1)}%)</p>
              </div>
              <div className="summary-card">
                <h3>Работы</h3>
                <p className="amount">{formatCurrency(estimation.labor_cost)}</p>
                <p className="percentage">({((estimation.labor_cost / estimation.total_cost) * 100).toFixed(1)}%)</p>
              </div>
              <div className="summary-card">
                <h3>Дополнительно</h3>
                <p className="amount">{formatCurrency(estimation.additional_cost)}</p>
                <p className="percentage">({((estimation.additional_cost / estimation.total_cost) * 100).toFixed(1)}%)</p>
              </div>
            </div>

            {estimation.breakdown && (
              <div className="estimation-breakdown">
                <h3>Детальная разбивка</h3>

                <div className="breakdown-section">
                  <h4>По категориям:</h4>
                  <div className="category-grid">
                    <div className="category-item">
                      <span>Полы:</span>
                      <span>{formatCurrency(estimation.flooring_cost || 0)}</span>
                    </div>
                    <div className="category-item">
                      <span>Стены:</span>
                      <span>{formatCurrency(estimation.wall_cost || 0)}</span>
                    </div>
                    <div className="category-item">
                      <span>Потолок:</span>
                      <span>{formatCurrency(estimation.ceiling_cost || 0)}</span>
                    </div>
                    <div className="category-item">
                      <span>Электрика:</span>
                      <span>{formatCurrency(estimation.electrical_cost || 0)}</span>
                    </div>
                    <div className="category-item">
                      <span>Сантехника:</span>
                      <span>{formatCurrency(estimation.plumbing_cost || 0)}</span>
                    </div>
                    <div className="category-item">
                      <span>HVAC:</span>
                      <span>{formatCurrency(estimation.hvac_cost || 0)}</span>
                    </div>
                    <div className="category-item">
                      <span>Мебель:</span>
                      <span>{formatCurrency(estimation.furniture_cost || 0)}</span>
                    </div>
                    <div className="category-item">
                      <span>Освещение:</span>
                      <span>{formatCurrency(estimation.lighting_cost || 0)}</span>
                    </div>
                    <div className="category-item">
                      <span>Декор:</span>
                      <span>{formatCurrency(estimation.decoration_cost || 0)}</span>
                    </div>
                  </div>
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


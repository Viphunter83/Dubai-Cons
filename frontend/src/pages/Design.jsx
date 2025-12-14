import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../config'
import { useNavigate } from 'react-router-dom'
import './Design.css'
import DesignPresets from '../components/DesignPresets'
import '../components/DesignPresets.css'
import ThreeDViewer from '../components/ThreeDViewer'

function Design() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('presets') // 'presets' or 'text'
  const [designData, setDesignData] = useState({
    client_preferences: '',
    project_details: '',
    use_pro_for_image: false
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('2d') // '2d' or '3d'

  // Восстановление дизайна из localStorage при загрузке
  useEffect(() => {
    const savedResult = localStorage.getItem('lastDesignResult')
    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult))
      } catch (e) {
        console.error('Error loading saved design:', e)
      }
    }
  }, [])

  // Сохранение дизайна в localStorage при изменении result
  useEffect(() => {
    if (result) {
      localStorage.setItem('lastDesignResult', JSON.stringify(result))
      localStorage.setItem('lastDesignTime', new Date().toISOString())
    }
  }, [result])

  const handlePresetSelect = async (presetData) => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await axios.post(`${config.apiBaseUrl}/design/generate-by-presets`, presetData)
      const designResult = response.data
      setResult(designResult)
      // Сохраняем в localStorage
      localStorage.setItem('lastDesignResult', JSON.stringify(designResult))
      localStorage.setItem('lastDesignTime', new Date().toISOString())
    } catch (error) {
      console.error('Error generating design:', error)
      setError('Ошибка при генерации дизайна. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await axios.post(`${config.apiBaseUrl}/design/generate`, designData)
      setResult(response.data)
    } catch (error) {
      console.error('Error generating design:', error)
      if (error.response?.data?.detail) {
        const details = error.response.data.detail
        if (Array.isArray(details)) {
          setError(details.map(d => d.msg).join(', '))
        } else {
          setError(details)
        }
      } else {
        setError('Error generating design. Please make sure both fields have at least 10 characters.')
      }
    } finally {
      setLoading(false)
    }
  }


  const handleDownloadReport = async () => {
    if (!result) return

    try {
      // Show simple loading indicator or toast if available, or just rely on browser download
      const response = await axios.post(
        `${config.apiBaseUrl}/reports/generate`,
        {
          project_details: { project_details: designData.project_details }, // Wrap to match schema if needed
          design_result: result
        },
        { responseType: 'blob' }
      )

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Design_Report_${new Date().toISOString().slice(0, 10)}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

    } catch (error) {
      console.error("Error downloading report:", error)
      alert("Failed to download report")
    }
  }

  return (
    <div className="design">
      <div className="container">
        <h1>AI Design Generator</h1>

        <div className="mode-selector">
          <button
            className={`mode-btn ${mode === 'presets' ? 'active' : ''}`}
            onClick={() => setMode('presets')}
          >
            🎨 Через пресеты
          </button>
          <button
            className={`mode-btn ${mode === 'text' ? 'active' : ''}`}
            onClick={() => setMode('text')}
          >
            ✍️ Свободный текст
          </button>
        </div>

        {mode === 'presets' ? (
          <DesignPresets onPresetSelect={handlePresetSelect} />
        ) : (
          <div className="design-form">
            <div className="form-group">
              <label>Client Preferences</label>
              <textarea
                value={designData.client_preferences}
                onChange={(e) => setDesignData({ ...designData, client_preferences: e.target.value })}
                placeholder="e.g., Modern luxury style with marble and gold accents, open space design"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Project Details</label>
              <textarea
                value={designData.project_details}
                onChange={(e) => setDesignData({ ...designData, project_details: e.target.value })}
                placeholder="e.g., 500 sqm villa, 4 bedrooms, located in Palm Jumeirah"
                rows={3}
              />
            </div>

            <div className="form-group checkbox-group" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '15px 0',
              padding: '12px',
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}>
              <input
                type="checkbox"
                id="proModel"
                checked={designData.use_pro_for_image}
                onChange={(e) => setDesignData({ ...designData, use_pro_for_image: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: '#d4af37' }}
              />
              <label htmlFor="proModel" style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>
                ⚡ Use Nano Banana Pro (Official Gemini 3.0 Pro)
                <span style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 'normal',
                  color: 'rgba(255,255,255,0.7)',
                  marginTop: '2px'
                }}>
                  Enables high-fidelity 4K renders and advanced reasoning
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={handleGenerate} disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Generating...' : 'Generate Design Concept'}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    const res = await axios.post(`${config.apiBaseUrl}/design/validate-compliance`, designData);
                    const report = res.data;
                    alert(`🛡️ Compliance Report:\nStatus: ${report.status}\n\nIssues: ${JSON.stringify(report.issues || [])}\n\nRecommendation: ${report.recommendation || 'None'}`);
                  } catch (e) {
                    alert("Error checking compliance: " + e.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                style={{ flex: 0.5, borderColor: '#00f2ea', color: '#00f2ea' }}
              >
                🛡️ Check Code
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message" style={{
            padding: '15px',
            backgroundColor: 'rgba(255, 0, 85, 0.1)',
            border: '1px solid #ff0055',
            borderRadius: '5px',
            marginTop: '20px',
            color: '#ff0055'
          }}>
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}

        {loading && !error && (
          <div className="loading-message" style={{
            padding: '20px',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            <p style={{ color: '#d4af37', fontSize: '1.2rem' }}>⏳ Генерация дизайна в процессе...</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
              AI генерирует концепцию дизайна. Это может занять 30-60 секунд.
              Пожалуйста, подождите...
            </p>
          </div>
        )}

        {result && (
          <div className="design-result">
            <h2>✅ Design Concept Generated</h2>
            <div className="view-toggle" style={{ marginBottom: '20px' }}>
              <button
                className={`btn ${viewMode === '2d' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('2d')}
                style={{ marginRight: '10px' }}
              >
                🖼️ 2D Image
              </button>
              <button
                className={`btn ${viewMode === '3d' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('3d')}
              >
                🎲 3D Model
              </button>
            </div>

            {viewMode === '3d' ? (
              <div className="three-d-viewer-container">
                <ThreeDViewer designData={result} />
              </div>
            ) : (
              <>
                {/* Display rooms designs if available */}
                {result.rooms_designs && result.rooms_designs.length > 0 && (
                  <div className="rooms-designs">
                    <h3>🎨 Room Designs:</h3>
                    {result.rooms_designs.map((room, idx) => (
                      <div key={idx} className="room-design-card" style={{
                        marginBottom: '20px',
                        padding: '15px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        background: '#f9f9f9'
                      }}>
                        <h4>{room.room_type} ({room.area} sqm) x {room.quantity}</h4>
                        {room.image_url && (
                          <img src={room.image_url} alt={room.room_type} style={{
                            maxWidth: '100%',
                            borderRadius: '4px',
                            marginTop: '10px'
                          }} />
                        )}
                        <p style={{ marginTop: '10px', color: '#666' }}>
                          {room.description.substring(0, 150)}...
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {result.image_url && (!result.rooms_designs || result.rooms_designs.length === 0) && (
                  <div className="design-image">
                    <img src={result.image_url} alt="Generated design" />
                  </div>
                )}
              </>
            )}

            <div className="description">
              <h3>Description:</h3>
              <p>{result.description}</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          gap: '10px'
        }}>
          <button onClick={() => {
            const savedTime = localStorage.getItem('lastDesignTime')
            if (savedTime) {
              const time = new Date(savedTime).toLocaleString()
              alert(`Дизайн сохранен автоматически!\nСгенерирован: ${time}\n\nВы можете вернуться на эту страницу и дизайн не пропадет.`)
            }
          }} style={{
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            ✓ Дизайн сохранен автоматически
          </button>

          <button onClick={handleDownloadReport} style={{
            padding: '10px 20px',
            background: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            📄 Скачать PDF отчет
          </button>

          <button onClick={() => navigate('/estimation')} style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            💰 Перейти к расчету стоимости →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Design

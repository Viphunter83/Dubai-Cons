import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../config'

function DesignPresets({ onPresetSelect }) {
  const [presets, setPresets] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [rooms, setRooms] = useState([])
  const [selectedBudget, setSelectedBudget] = useState(null)
  const [additionalPrefs, setAdditionalPrefs] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPresets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchPresets = async () => {
    try {
      setLoading(true)
      console.log(`Fetching presets from ${config.apiBaseUrl}/presets/design-presets`)
      const response = await axios.get(`${config.apiBaseUrl}/presets/design-presets`)
      console.log('Presets received:', response.data)
      if (response.data && response.data.property_types) {
        setPresets(response.data)
        setError(null)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error fetching presets:', error)
      setError(`Не удалось загрузить пресеты: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const addRoom = () => {
    setRooms([...rooms, { type: '', quantity: 1, area: 20 }])
  }

  const updateRoom = (index, field, value) => {
    const newRooms = [...rooms]
    newRooms[index] = { ...newRooms[index], [field]: value }
    setRooms(newRooms)
  }

  const removeRoom = (index) => {
    setRooms(rooms.filter((_, i) => i !== index))
  }

  const handleGenerate = () => {
    if (!selectedType || !selectedStyle || rooms.length === 0 || !selectedBudget) {
      alert('Пожалуйста, заполните все поля')
      return
    }

    onPresetSelect({
      property_type: selectedType,
      design_style: selectedStyle,
      rooms: rooms.map(r => ({
        type: r.type,
        quantity: r.quantity,
        area: r.area
      })),
      budget_range: selectedBudget,
      additional_preferences: additionalPrefs
    })
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>⏳ Загрузка пресетов...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', background: '#fee', borderRadius: '8px' }}>
        <h3>❌ Ошибка</h3>
        <p>{error}</p>
        <button onClick={fetchPresets} style={{
          marginTop: '10px',
          padding: '8px 16px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Попробовать снова
        </button>
      </div>
    )
  }

  if (!presets) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Нет данных о пресетах</p>
        <button onClick={fetchPresets}>Загрузить снова</button>
      </div>
    )
  }

  return (
    <div className="design-presets">
      <h2>Выберите параметры дизайна</h2>

      <div className="preset-section">
        <h3>Тип недвижимости</h3>
        <div className="preset-grid">
          {presets.property_types.map(type => {
            let iconSrc = null;
            if (type.value === 'villa') iconSrc = '/assets/preset_villa_gold_1765726333871.png';
            else if (type.value === 'apartment') iconSrc = '/assets/preset_apartment_gold_1765726349490.png';

            return (
              <div
                key={type.value}
                className={`preset-card ${selectedType === type.value ? 'selected' : ''}`}
                onClick={() => setSelectedType(type.value)}
              >
                {iconSrc ? (
                  <img src={iconSrc} alt={type.label} className="icon" style={{ width: '64px', height: '64px', objectFit: 'contain', margin: '0 auto 15px' }} />
                ) : (
                  <span className="icon">{type.icon}</span>
                )}
                <span className="label">{type.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="preset-section">
        <h3>Стиль дизайна</h3>
        <div className="preset-grid">
          {presets.design_styles.map(style => (
            <div
              key={style.value}
              className={`preset-card ${selectedStyle === style.value ? 'selected' : ''}`}
              onClick={() => setSelectedStyle(style.value)}
            >
              <span className="label">{style.label}</span>
              <p className="description">{style.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="preset-section">
        <h3>Помещения</h3>
        <button className="btn btn-secondary" onClick={addRoom}>
          + Добавить помещение
        </button>

        {rooms.map((room, index) => (
          <div key={index} className="room-input">
            <select
              value={room.type}
              onChange={(e) => updateRoom(index, 'type', e.target.value)}
              className="room-type-select"
            >
              <option value="">Выберите тип</option>
              {(selectedType && presets.property_specific_rooms && presets.property_specific_rooms[selectedType]
                ? presets.property_specific_rooms[selectedType]
                : presets.room_types).map(rt => (
                  <option key={rt.value} value={rt.value}>
                    {rt.icon} {rt.label} ({rt.typical_area} sqm)
                  </option>
                ))}
            </select>

            <input
              type="number"
              placeholder="Количество"
              value={room.quantity}
              onChange={(e) => updateRoom(index, 'quantity', parseInt(e.target.value))}
              min="1"
              className="room-quantity-input"
            />

            <input
              type="number"
              placeholder="Площадь (кв.м)"
              value={room.area}
              onChange={(e) => updateRoom(index, 'area', parseFloat(e.target.value))}
              min="0"
              step="0.1"
              className="room-area-input"
            />

            <button onClick={() => removeRoom(index)} className="btn-remove">
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="preset-section">
        <h3>Бюджет</h3>
        <select
          value={selectedBudget || ''}
          onChange={(e) => setSelectedBudget(e.target.value)}
          className="budget-select"
        >
          <option value="">Выберите бюджет</option>
          {presets.budget_ranges.map(range => (
            <option key={range.label} value={range.label}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className="preset-section">
        <h3>Дополнительные предпочтения</h3>
        <textarea
          value={additionalPrefs}
          onChange={(e) => setAdditionalPrefs(e.target.value)}
          placeholder="Любые дополнительные пожелания..."
          rows={3}
          className="additional-prefs"
        />
      </div>

      <button className="btn btn-primary" onClick={handleGenerate}>
        Сгенерировать дизайн
      </button>
    </div>
  )
}

export default DesignPresets


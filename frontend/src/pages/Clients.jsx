import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../config'
import './Clients.css'

function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/clients/`)
      setClients(response.data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading clients...</div>
  }

  return (
    <div className="clients">
      <div className="container">
        <h1>Clients</h1>

        <div className="clients-grid">
          {clients.map(client => (
            <div key={client.id} className="client-card">
              <h3>{client.name}</h3>
              <p className="email">📧 {client.email || 'No email'}</p>
              {client.phone && <p className="phone">📞 {client.phone}</p>}
              {client.segment && (
                <span className={`badge badge-${client.segment}`}>
                  {client.segment}
                </span>
              )}
            </div>
          ))}
        </div>

        {clients.length === 0 && (
          <div className="empty-state">
            <p>No clients yet. Add your first client!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Clients

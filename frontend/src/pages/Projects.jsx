import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../config'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${config.apiBaseUrl}/projects`)
      setProjects(res.data)
    } catch (e) {
      console.error("Failed to fetch projects", e)
    } finally {
      setLoading(false)
    }
  }

  // Helper to get diverse images for demo if project has no image
  const getProjectImage = (id) => {
    const images = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop'
    ];
    return images[id % images.length];
  }

  return (
    <div className="min-h-screen bg-background text-white p-6 md:p-12 pt-24">
      <div className="max-w-[1920px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Your Portfolio
            </h1>
            <p className="text-gray-400 text-lg">
              Manage and visualize your ongoing construction developments.
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate('/design')}>
            + New Project
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[400px] bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl">
            <h3 className="text-2xl text-gray-500 mb-4">No projects yet</h3>
            <Button variant="secondary" onClick={() => navigate('/design')}>Start Your First Design</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="group cursor-pointer"
                >
                  <GlassCard className="h-full !p-0 overflow-hidden hover:border-gold/50 transition-colors relative">
                    {/* Cover Image */}
                    <div className="h-64 overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                      <img
                        src={getProjectImage(project.id)}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-gold">
                        {project.status || 'In Progress'}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">{project.title}</h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {project.description || 'No description provided.'}
                      </p>

                      <div className="flex justify-between items-center text-xs text-gray-500 font-mono border-t border-white/5 pt-4">
                        <span>ID: #{project.id.toString().padStart(4, '0')}</span>
                        <span>{new Date(project.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects

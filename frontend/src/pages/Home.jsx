import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import Hero3D from '../components/home/Hero3D';
import BentoGrid from '../components/home/BentoGrid';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-black/40" />}>
        <Hero3D />
      </Suspense>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-auto"
        >
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gold/30 bg-black/40 backdrop-blur-md text-gold text-sm font-medium tracking-wide">
            ✨ The Future of Construction Tech
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold mb-8 tracking-tighter">
            <span className="block text-white mb-2 drop-shadow-lg">Build Your</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold via-white to-gold animate-gradient-x drop-shadow-gold">
              Legacy
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12 font-light leading-relaxed drop-shadow-md">
            AI-driven architecture. Real-time estimation. <br />
            <span className="text-gold font-normal">From concept to reality in seconds.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              variant="primary"
              className="w-full sm:w-auto text-lg px-10 py-5 shadow-glow hover:shadow-glow-hover"
              onClick={() => navigate('/design')}
            >
              Start AI Design
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto text-lg px-10 py-5 backdrop-blur-md bg-black/20 border-white/20"
              onClick={() => navigate('/projects')}
            >
              View Portfolio
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 pointer-events-none"
      >
        <span className="text-xs uppercase tracking-widest mb-2 block text-center">Scroll</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2 mx-auto">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};

const ProcessSection = () => {
  const steps = [
    { num: '01', title: 'Define', desc: 'Choose presets or describe your vision.' },
    { num: '02', title: 'Generate', desc: 'AI creates visual concepts & 3D models.' },
    { num: '03', title: 'Validate', desc: 'Auto-check compliance with Dubai codes.' },
    { num: '04', title: 'Execute', desc: 'Get cost estimates and start building.' }
  ];

  return (
    <div className="py-24 bg-black/40 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-black/50 to-background pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="text-white">From Idea to Reality</span>
          <span className="block text-gold text-2xl mt-4 font-normal">Our Process</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group h-full">
              <div className="text-8xl font-bold text-white/5 absolute -top-10 -left-6 group-hover:text-gold/10 transition-colors z-0">
                {step.num}
              </div>
              <div className="relative z-10 glass p-8 rounded-2xl border-t border-white/10 hover:-translate-y-2 transition-transform duration-300 hover:border-gold/20 hover:shadow-glow h-full flex flex-col justify-between bg-gradient-to-b from-white/5 to-transparent">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
                <div className="w-8 h-1 bg-gold/20 mt-6 rounded-full group-hover:bg-gold transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="bg-background min-h-screen text-white selection:bg-gold selection:text-black">
      <HeroSection />
      <BentoGrid />
      <ProcessSection />

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-sm glass mt-12">
        <p className="mb-2">© 2025 Dubai Cons AI Suite. Designed for the Future.</p>
        <div className="flex justify-center gap-4">
          <span className="hover:text-gold cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-gold cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </footer>
    </div>
  )
}

export default Home

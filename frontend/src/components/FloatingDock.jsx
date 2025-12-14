import React from 'react';
import { NavLink } from 'react-router-dom';

const FloatingDock = () => {
    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '12px',
            padding: '12px 20px',
            background: 'rgba(20, 20, 25, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
            zIndex: 1000
        }}>
            <DockItem to="/" icon="/assets/nav_home_glass_1765726281369.png" label="Home" />
            <DockItem to="/projects" icon="📁" label="Projects" />
            <DockItem to="/clients" icon="👥" label="Clients" />
            <DockItem to="/design" icon="/assets/nav_design_glass_1765726295956.png" label="Design" />
            <DockItem to="/estimation" icon="/assets/nav_estimate_glass_1765726314997.png" label="Finance" />
        </div>
    );
};

const DockItem = ({ to, icon, label }) => {
    const isImage = icon.includes('.png');
    return (
        <NavLink
            to={to}
            className={({ isActive }) => (isActive ? 'dock-active' : '')}
            style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: isActive ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#d4af37' : '#a0a0b0',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: isActive ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                position: 'relative'
            })}
        >
            {isImage ? (
                <img src={icon} alt={label} style={{ width: '28px', height: '28px', marginBottom: '2px', objectFit: 'contain' }} />
            ) : (
                <span style={{ fontSize: '24px', marginBottom: '2px' }}>{icon}</span>
            )}
            <span style={{ fontSize: '9px', fontWeight: '600', opacity: 0.8 }}>{label}</span>
        </NavLink>
    );
};

export default FloatingDock;

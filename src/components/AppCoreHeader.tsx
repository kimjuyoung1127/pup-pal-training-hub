import React from 'react';
import { NavLink } from 'react-router-dom';

const AppCoreHeader: React.FC = () => {
  const headerStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 40,
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    margin: '0 auto',
    borderBottom: '1px solid #e5e7eb',
    // Hide scrollbar for a cleaner look
    scrollbarWidth: 'none', // Firefox
  };

  const linkStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    color: '#4b5563',
    transition: 'color 0.2s',
    fontSize: '0.9rem',
    flexShrink: 0, // Prevent links from shrinking
  };

  const activeStyle: React.CSSProperties = {
    color: '#831843',
    fontWeight: '600',
    borderBottom: '2px solid #831843',
    marginBottom: '-1px', // Align with the bottom border
  };

  const navItems = [
    { path: "/app", label: "홈", end: true },
    { path: "/app/dog-info", label: "강아지 등록" },
    { path: "/app/my-page", label: "내 프로필" },
    { path: "/app/training-recommender", label: "훈련 과정" },
    { path: "/app/history", label: "훈련 기록" },
    { path: "/app/settings", label: "설정" },
  ];

  return (
    <header style={headerStyle}>
      <style>{`
        /* For Webkit browsers like Chrome, Safari */
        .scrollable-nav::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <nav style={navStyle} className="scrollable-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            style={({ isActive }) =>
              isActive ? { ...linkStyle, ...activeStyle } : linkStyle
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default AppCoreHeader;
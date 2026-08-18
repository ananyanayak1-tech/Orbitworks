import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import picLogo from '../assets/pic.png';
import { 
  Menu, 
  X, 
  ArrowRight, 
  ListTodo, 
  ShieldCheck, 
  Megaphone, 
  Users, 
  Sparkles
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Dynamic Fonts Load to ensure design continuity
  useEffect(() => {
    const link1 = document.createElement('link');
    link1.rel = 'preconnect';
    link1.href = 'https://fonts.googleapis.com';
    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    const link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Manrope:wght@800;900&display=swap';

    document.head.appendChild(link1);
    document.head.appendChild(link2);
    document.head.appendChild(link3);

    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
      document.head.removeChild(link3);
    };
  }, []);

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        backgroundColor: '#ffffff',
        fontFamily: 'IBM Plex Sans, sans-serif',
        overflowX: 'hidden'
      }}
    >
      {/* Dynamic CSS styles */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .landing-nav-link {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #102A43;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0.5rem 0.9rem;
          letter-spacing: 0.03em;
          position: relative;
        }

        .landing-nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background-color: #087E8B;
          transition: all 0.25s ease;
          transform: translateX(-50%);
        }

        .landing-nav-link:hover {
          color: #087E8B;
        }

        .landing-nav-link:hover::after {
          width: 60%;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          cursor: pointer;
        }

        .logo-img {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .logo-container:hover .logo-img {
          transform: scale(1.08) rotate(8deg);
        }

        .btn-outline {
          padding: 0.65rem 1.45rem;
          font-size: 0.95rem;
          font-weight: 700;
          color: #087E8B;
          background-color: transparent;
          border: 2px solid #087E8B;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-outline:hover {
          background-color: rgba(8, 126, 139, 0.06);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(8, 126, 139, 0.1);
        }

        .btn-outline:active {
          transform: translateY(0);
        }

        .btn-filled {
          padding: 0.65rem 1.45rem;
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          background-color: #087E8B;
          border: 2px solid #087E8B;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(8, 126, 139, 0.15);
        }

        .btn-filled:hover {
          background-color: #0b6c77;
          border-color: #0b6c77;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(8, 126, 139, 0.25);
        }

        .btn-filled:active {
          transform: translateY(0);
        }

        .feature-card {
          background: #ffffff;
          border: 2px solid #CBD5E1;
          border-radius: 16px;
          padding: 2.75rem 2.25rem;
          box-sizing: border-box;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
        }
 
        .feature-card:hover {
          transform: translateY(-6px);
          border-color: #087E8B;
          box-shadow: 0 25px 50px rgba(8, 126, 139, 0.08);
        }

        .nav-menu-mobile {
          display: none;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .hero-title-pulse {
          animation: titlePulse 8s infinite alternate ease-in-out;
        }

        @keyframes titlePulse {
          0% { text-shadow: 0 0 0px rgba(8,126,139,0); }
          100% { text-shadow: 0 0 30px rgba(8,126,139,0.06); }
        }

        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .nav-menu-mobile {
            display: flex;
            align-items: center;
          }
        }
      `}</style>

      {/* 1. STICKY NAVIGATION BAR */}
      <header 
        style={{ 
          height: '78px',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 5vw',
          boxSizing: 'border-box',
          zIndex: 100
        }}
      >
        {/* Wordmark logo */}
        <div className="logo-container" onClick={() => navigate('/')}>
          <img className="logo-img" src={picLogo} alt="Logo" />
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-0.6px' }}>
            <span style={{ color: '#102A43' }}>orbit</span>
            <span style={{ color: '#087E8B' }}>works</span>
          </span>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="desktop-nav">
          <a href="#product" className="landing-nav-link">Product</a>
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#how-it-works" className="landing-nav-link">How It Works</a>
          <a href="#about" className="landing-nav-link">About</a>
        </nav>

        {/* Right CTA Actions (Desktop) */}
        <div className="desktop-nav" style={{ gap: '0.85rem' }}>
          <button className="btn-outline" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-filled" onClick={() => navigate('/request-demo')}>Request a Demo</button>
        </div>

        {/* Hamburger Menu Toggle (Mobile) */}
        <div className="nav-menu-mobile">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#102A43',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem'
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Responsive Navigation Overlay */}
      {menuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: '78px',
            left: 0,
            width: '100%',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem 5vw',
            boxSizing: 'border-box',
            gap: '1rem',
            zIndex: 99
          }}
        >
          <a href="#product" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Product</a>
          <a href="#features" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="landing-nav-link" onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="#about" className="landing-nav-link" onClick={() => setMenuOpen(false)}>About</a>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
            <button className="btn-outline" style={{ width: '100%' }} onClick={() => { setMenuOpen(false); navigate('/login'); }}>Login</button>
            <button className="btn-filled" style={{ width: '100%' }} onClick={() => { setMenuOpen(false); navigate('/request-demo'); }}>Request a Demo</button>
          </div>
        </div>
      )}

      {/* Offset for Sticky Header */}
      <div style={{ height: '78px' }} />

      {/* 2. HERO SECTION */}
      <section 
        id="product" 
        style={{ 
          position: 'relative', 
          backgroundColor: '#F4F7F5', 
          padding: '7rem 5vw 8rem 5vw', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Concentric SVG Orbit Graphic Background (Shared visual language with login page) */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '600px', 
            height: '600px', 
            opacity: 0.35, 
            pointerEvents: 'none', 
            zIndex: 0 
          }}
        >
          <svg viewBox="0 0 400 400" width="100%" height="100%">
            <circle cx="200" cy="200" r="180" fill="none" stroke="#D5E1E5" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="200" cy="200" r="130" fill="none" stroke="#D5E1E5" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="200" cy="200" r="80" fill="none" stroke="#D5E1E5" strokeWidth="1" />
            
            {/* Animated/Static colored nodes along the path */}
            <circle cx="200" cy="20" r="6" fill="#087E8B" />
            <circle cx="70" cy="200" r="5" fill="#1769E0" />
            <circle cx="280" cy="200" r="4" fill="#7BCFC7" />
            <circle cx="200" cy="200" r="8" fill="#102A43" opacity="0.08" />
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '840px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          {/* Tagline Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(8, 126, 139, 0.08)', color: '#087E8B', padding: '6px 16px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <Sparkles size={12} />
            The Workplace in Motion
          </div>

          {/* Headline */}
          <h1 
            className="hero-title-pulse"
            style={{ 
              fontFamily: 'Manrope, sans-serif', 
              fontSize: 'clamp(38px, 5.5vw, 68px)', 
              fontWeight: '900', 
              lineHeight: '1.05', 
              color: '#102A43', 
              margin: 0,
              letterSpacing: '-1.5px'
            }}
          >
            Run your workforce on <br />
            one clear <span style={{ color: '#087E8B' }}>orbit.</span>
          </h1>

          {/* Supporting Copy */}
          <p 
            style={{ 
              fontSize: 'clamp(17px, 2.2vw, 21px)', 
              color: '#526579', 
              lineHeight: '1.65', 
              margin: '0.5rem 0 1.5rem 0', 
              maxWidth: '680px'
            }}
          >
            Task management and team coordination for CEOs, HR, and employees — all in one unified platform.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn-filled" style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }} onClick={() => navigate('/request-demo')}>
              Request a Demo
            </button>
            <button 
              className="btn-outline" 
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }} 
              onClick={() => {
                const section = document.getElementById('how-it-works');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              See how it works
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT / FEATURES GRID */}
      <section 
        id="features" 
        style={{ 
          padding: '7.5rem 5vw', 
          backgroundColor: '#ffffff',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#087E8B', fontWeight: '700', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Engineered for Synergy
            </span>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2.75rem', fontWeight: '800', margin: '0.5rem 0 0 0', color: '#102A43', letterSpacing: '-0.5px' }}>
              Designed around how teams actually interact
            </h2>
          </div>

          {/* Grid Layout */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '2rem' 
            }}
          >
            {/* Card 1 */}
            <div className="feature-card">
              <div style={{ color: '#087E8B', marginBottom: '1.25rem' }}>
                <ListTodo size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#102A43', fontFamily: 'Manrope, sans-serif' }}>
                Task Management
              </h3>
              <p style={{ color: '#526579', fontSize: '1.05rem', lineHeight: '1.6', margin: 0 }}>
                Create, delegate, and check off objectives. Keep a precise log of active tasks across corporate departments.
              </p>
            </div>

            {/* Card 2 */}
            <div className="feature-card">
              <div style={{ color: '#1769E0', marginBottom: '1.25rem' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#102A43', fontFamily: 'Manrope, sans-serif' }}>
                Role-Based Portals
              </h3>
              <p style={{ color: '#526579', fontSize: '1.05rem', lineHeight: '1.6', margin: 0 }}>
                Custom layout dashboards for CEOs, HR representatives, and Employees. Only see the data relevant to your focus.
              </p>
            </div>

            {/* Card 3 */}
            <div className="feature-card">
              <div style={{ color: '#087E8B', marginBottom: '1.25rem' }}>
                <Megaphone size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#102A43', fontFamily: 'Manrope, sans-serif' }}>
                Announcements
              </h3>
              <p style={{ color: '#526579', fontSize: '1.05rem', lineHeight: '1.6', margin: 0 }}>
                Broadcast company announcements directly. Align everyone instantly on structural updates, holidays, or news.
              </p>
            </div>

            {/* Card 4 */}
            <div className="feature-card">
              <div style={{ color: '#7BCFC7', marginBottom: '1.25rem' }}>
                <Users size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#102A43', fontFamily: 'Manrope, sans-serif' }}>
                Team Overview
              </h3>
              <p style={{ color: '#526579', fontSize: '1.05rem', lineHeight: '1.6', margin: 0 }}>
                Real-time tracking of employee presence, work stats, active tasks, and team distributions at a glance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section 
        id="how-it-works" 
        style={{ 
          padding: '7.5rem 5vw', 
          backgroundColor: '#F4F7F5',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#087E8B', fontWeight: '700', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              The Orbit Loop
            </span>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2.75rem', fontWeight: '800', margin: '0.5rem 0 0 0', color: '#102A43', letterSpacing: '-0.5px' }}>
              Streamline work in three steps
            </h2>
          </div>

          {/* Connecting 3-Step Flow */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'stretch',
              position: 'relative',
              flexWrap: 'wrap',
              gap: '2rem'
            }}
          >
            {/* Connecting Background Line (Desktop only) */}
            <div 
              className="desktop-only-divider"
              style={{
                position: 'absolute',
                top: '32px',
                left: '16.67%',
                width: '66.67%',
                height: '2px',
                borderTop: '2px dashed #94A3B8',
                zIndex: 0
              }}
            />

            {/* Step 1 */}
            <div style={{ flex: 1, minWidth: '280px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  backgroundColor: '#ffffff', 
                  border: '2.5px solid #087E8B', 
                  color: '#087E8B', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1.5rem auto',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  boxShadow: '0 8px 24px rgba(8, 126, 139, 0.05)'
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#102A43', fontFamily: 'Manrope, sans-serif' }}>
                Sign in to Portal
              </h3>
              <p style={{ color: '#526579', fontSize: '1.15rem', lineHeight: '1.6', padding: '0 1rem', margin: 0 }}>
                Choose your specific role shortcut or sign in with your corporate credential key.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ flex: 1, minWidth: '280px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  backgroundColor: '#ffffff', 
                  border: '2.5px solid #102A43', 
                  color: '#102A43', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1.5rem auto',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  boxShadow: '0 8px 24px rgba(16, 42, 67, 0.05)'
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#102A43', fontFamily: 'Manrope, sans-serif' }}>
                Manage Tasks
              </h3>
              <p style={{ color: '#526579', fontSize: '1.15rem', lineHeight: '1.6', padding: '0 1rem', margin: 0 }}>
                Create project goals, delegate tasks, track workflow boards, and request clearances.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ flex: 1, minWidth: '280px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  backgroundColor: '#ffffff', 
                  border: '2.5px solid #7BCFC7', 
                  color: '#087E8B', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1.5rem auto',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  boxShadow: '0 8px 24px rgba(123, 207, 199, 0.05)'
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#102A43', fontFamily: 'Manrope, sans-serif' }}>
                Track Progress
              </h3>
              <p style={{ color: '#526579', fontSize: '1.15rem', lineHeight: '1.6', padding: '0 1rem', margin: 0 }}>
                Collect completions, generate summaries, check gate statuses, and build milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT SECTION */}
      <section 
        id="about" 
        style={{ 
          padding: '7.5rem 5vw', 
          backgroundColor: '#ffffff',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: '#087E8B', fontWeight: '700', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Our Mission
          </span>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2.75rem', fontWeight: '800', margin: '0.5rem 0 1.5rem 0', color: '#102A43', letterSpacing: '-0.5px' }}>
            Simplifying alignment across corporate tiers
          </h2>
          <p style={{ color: '#526579', fontSize: '1.2rem', lineHeight: '1.75', margin: '0 0 2rem 0' }}>
            OrbitWorks was created to bridge the communication gaps between executive visionaries, administrative coordinators, and front-line executers. By building structured roles that seamlessly feed tasks, announcements, and progress logs to one another, OrbitWorks turns standard corporate friction into one single clear flow of momentum.
          </p>
          <div style={{ paddingTop: '2rem', display: 'flex', justifyContent: 'center', gap: '3rem' }}>
            <div>
              <h4 style={{ margin: '0 0 0.2rem 0', color: '#102A43', fontSize: '1.1rem', fontWeight: '700' }}>2026</h4>
              <p style={{ margin: 0, color: '#526579', fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'IBM Plex Mono, monospace' }}>Project Founded</p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.2rem 0', color: '#102A43', fontSize: '1.1rem', fontWeight: '700' }}>100%</h4>
              <p style={{ margin: 0, color: '#526579', fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'IBM Plex Mono, monospace' }}>Open Workspace</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer 
        style={{ 
          textAlign: 'center', 
          padding: '1.25rem 5vw', 
          backgroundColor: '#F4F6F5',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          fontFamily: 'IBM Plex Sans, sans-serif',
          fontSize: '0.85rem',
          fontWeight: '600',
          color: '#526579',
          marginTop: 'auto',
          boxSizing: 'border-box',
          letterSpacing: '0.03em'
        }}
      >
        <div style={{ marginBottom: '0.6rem' }}>
          © 2026 OrbitWorks · {' '}
          <a 
            href="/privacy" 
            onClick={(e) => { e.preventDefault(); alert('Privacy Policy placeholder'); }}
            style={{ color: '#087E8B', textDecoration: 'none', fontWeight: '700', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.target.style.color = '#102A43'}
            onMouseOut={(e) => e.target.style.color = '#087E8B'}
          >
            Privacy Policy
          </a>
          {' '}·{' '}
          <a 
            href="/terms" 
            onClick={(e) => { e.preventDefault(); alert('Terms of Service placeholder'); }}
            style={{ color: '#087E8B', textDecoration: 'none', fontWeight: '700', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.target.style.color = '#102A43'}
            onMouseOut={(e) => e.target.style.color = '#087E8B'}
          >
            Terms of Service
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: '#526579', 
              transition: 'all 0.2s', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: 'rgba(0, 0, 0, 0.02)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#087E8B';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#087E8B';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
              e.currentTarget.style.color = '#526579';
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
            }}
            title="Twitter"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: '#526579', 
              transition: 'all 0.2s', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: 'rgba(0, 0, 0, 0.02)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#087E8B';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#087E8B';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
              e.currentTarget.style.color = '#526579';
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
            }}
            title="Instagram"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </a>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: '#526579', 
              transition: 'all 0.2s', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: 'rgba(0, 0, 0, 0.02)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#087E8B';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#087E8B';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
              e.currentTarget.style.color = '#526579';
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
            }}
            title="Facebook"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

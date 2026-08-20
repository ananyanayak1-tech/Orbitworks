import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import picLogo from '../assets/pic.png';
import teamworkImg from '../assets/teamwork.png';
import { 
  Menu, 
  X, 
  ArrowRight, 
  ListTodo, 
  ShieldCheck, 
  Megaphone, 
  Users,
  ChevronDown,
  LayoutDashboard,
  MessageSquare
} from 'lucide-react';

// Scroll reveal helper component using IntersectionObserver
const ScrollReveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.1 });

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`reveal-element ${isVisible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const words = ['orbit.', 'flow.', 'rhythm.', 'synergy.', 'momentum.'];

const Landing = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ceo');
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Typewriter effect variables
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const word = words[currentWordIdx];
    const typingSpeed = isDeleting ? 60 : 120;

    if (!isDeleting && currentText === word) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIdx((prev) => (prev + 1) % words.length);
    } else {
      timer = setTimeout(() => {
        setCurrentText(
          isDeleting 
            ? word.substring(0, currentText.length - 1)
            : word.substring(0, currentText.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx]);

  // Monitor page scroll to change header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    link3.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Manrope:wght@800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap';

    document.head.appendChild(link1);
    document.head.appendChild(link2);
    document.head.appendChild(link3);

    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
      document.head.removeChild(link3);
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        backgroundColor: '#F8FAFC', // Premium clean light background (Slate-50)
        color: '#0F172A', // Rich corporate slate
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      {/* Dynamic Global CSS styles */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        /* Premium Light Mode Glassmorphism */
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(15, 23, 42, 0.06);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-card:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(8, 126, 139, 0.25);
          box-shadow: 0 15px 40px rgba(8, 126, 139, 0.06);
        }

        /* Nav links */
        .landing-nav-link {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0.5rem 0.9rem;
          letter-spacing: 0.01em;
          position: relative;
        }

        .landing-nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background: linear-gradient(90deg, #087E8B, #0EA5E9);
          transition: all 0.25s ease;
          transform: translateX(-50%);
        }

        .landing-nav-link:hover {
          color: #0F172A;
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
          width: 34px;
          height: 34px;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(8, 126, 139, 0.15);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .logo-container:hover .logo-img {
          transform: scale(1.08) rotate(6deg);
        }

        /* Premium Buttons */
        .btn-outline {
          padding: 0.65rem 1.45rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: #0F172A;
          background-color: transparent;
          border: 1px solid rgba(15, 23, 42, 0.15);
          border-radius: 10px;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-outline:hover {
          background-color: rgba(15, 23, 42, 0.03);
          border-color: #087E8B;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(8, 126, 139, 0.08);
        }

        .btn-filled {
          padding: 0.65rem 1.45rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #087E8B 0%, #06B6D4 100%);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 15px rgba(8, 126, 139, 0.2);
        }

        .btn-filled:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(8, 126, 139, 0.35);
          background: linear-gradient(135deg, #0b93a3 0%, #0891b2 100%);
        }

        /* Scroll reveal system classes */
        .reveal-element {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal-element.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Interactive Dashboard Tab animations */
        .showroom-tab {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid transparent;
        }

        .showroom-tab.active {
          background: rgba(8, 126, 139, 0.08);
          border-color: rgba(8, 126, 139, 0.2);
          color: #087E8B;
        }

        /* Glowing blob animations */
        @keyframes floatBlob1 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(80px, 40px) scale(1.15); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes floatBlob2 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-60px, -60px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .glow-blob-1 {
          animation: floatBlob1 15s infinite ease-in-out;
        }

        .glow-blob-2 {
          animation: floatBlob2 18s infinite ease-in-out;
        }

        .nav-menu-mobile {
          display: none;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
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

        /* Typewriter Cursor & Blinking Animation */
        .typewriter-cursor {
          display: inline-block;
          width: 3.5px;
          height: 0.9em;
          background-color: #087E8B;
          margin-left: 5px;
          animation: cursorBlink 0.8s step-end infinite;
          vertical-align: middle;
        }
        @keyframes cursorBlink {
          from, to { background-color: transparent }
          50% { background-color: #087E8B; }
        }

        /* Floating Hero Image Animation (GIF-like aliveness) */
        @keyframes floatTeam {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .hero-team-image {
          animation: floatTeam 6s infinite ease-in-out;
          filter: drop-shadow(0 15px 35px rgba(8, 126, 139, 0.12));
        }

        /* Split Hero Grid Layout */
        .hero-split-grid {
          display: grid;
          grid-template-columns: 1.2fr 1.5fr;
          gap: 4rem;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          position: relative;
          z-index: 1;
        }
        
        .hero-left-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          gap: 1.75rem;
        }

        .hero-cta-buttons {
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
          justify-content: flex-start;
          z-index: 5;
        }

        @media (max-width: 900px) {
          .hero-split-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem;
          }
          .hero-left-content {
            align-items: center !important;
            text-align: center !important;
          }
          .hero-cta-buttons {
            justify-content: center !important;
          }
        }
      `}</style>

      {/* BACKGROUND DECORATIVE GLOWS */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {/* Glow Blob 1 */}
        <div 
          className="glow-blob-1"
          style={{
            position: 'absolute',
            top: '5%',
            left: '10%',
            width: '45vw',
            height: '45vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(8,126,139,0.06) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(90px)',
            opacity: 0.8
          }}
        />
        {/* Glow Blob 2 */}
        <div 
          className="glow-blob-2"
          style={{
            position: 'absolute',
            top: '35%',
            right: '5%',
            width: '40vw',
            height: '40vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(100px)',
            opacity: 0.7
          }}
        />
      </div>

      {/* 1. STICKY NAVIGATION BAR */}
      <header 
        style={{ 
          height: scrolled ? '70px' : '88px',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(248, 250, 252, 0.1)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(15, 23, 42, 0.06)' : '1px solid transparent',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 6vw',
          boxSizing: 'border-box',
          zIndex: 100,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Wordmark logo */}
        <div className="logo-container" onClick={() => navigate('/')}>
          <img className="logo-img" src={picLogo} alt="Logo" />
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: '900', fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#0F172A' }}>orbit</span>
            <span style={{ color: '#087E8B' }}>works</span>
          </span>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="desktop-nav">
          <a href="#product" className="landing-nav-link">Product</a>
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#showroom" className="landing-nav-link">Portals</a>
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
              color: '#0F172A',
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
            top: scrolled ? '70px' : '88px',
            left: 0,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 6vw',
            boxSizing: 'border-box',
            gap: '1.25rem',
            zIndex: 99
          }}
        >
          <a href="#product" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Product</a>
          <a href="#features" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#showroom" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Portals</a>
          <a href="#how-it-works" className="landing-nav-link" onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="#about" className="landing-nav-link" onClick={() => setMenuOpen(false)}>About</a>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
            <button className="btn-outline" style={{ width: '100%' }} onClick={() => { setMenuOpen(false); navigate('/login'); }}>Login</button>
            <button className="btn-filled" style={{ width: '100%' }} onClick={() => { setMenuOpen(false); navigate('/request-demo'); }}>Request a Demo</button>
          </div>
        </div>
      )}

      {/* Offset for Sticky Header */}
      <div style={{ height: '88px' }} />

      {/* 2. HERO SECTION */}
      <section 
        id="product" 
        style={{ 
          position: 'relative', 
          padding: '3rem 6vw 5rem 6vw', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          overflow: 'hidden',
          zIndex: 1,
          minHeight: 'calc(100vh - 88px)'
        }}
      >
        {/* Faded right-side background teamwork picture */}
        <div 
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '65%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden'
          }}
        >
          {/* Fading overlay to blend into light background (Horizontal) */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
              background: 'linear-gradient(90deg, #F8FAFC 0%, rgba(248, 250, 252, 0.4) 40%, rgba(248, 250, 252, 0) 100%)'
            }}
          />
          {/* Fading overlay to blend into light background (Vertical Bottom) */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '200px',
              zIndex: 2,
              background: 'linear-gradient(180deg, rgba(248, 250, 252, 0) 0%, #F8FAFC 100%)'
            }}
          />
          <img 
            className="hero-team-image"
            src={teamworkImg} 
            alt="Teamwork Background" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.48
            }}
          />
        </div>

        {/* SVG Concentric Orbit Path */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '55%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '750px', 
            height: '750px', 
            opacity: 0.15, 
            pointerEvents: 'none', 
            zIndex: 0 
          }}
        >
          <svg viewBox="0 0 400 400" width="100%" height="100%">
            <defs>
              <linearGradient id="orbGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#087E8B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6B46C1" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="180" fill="none" stroke="url(#orbGradLight)" strokeWidth="1.5" strokeDasharray="6 6">
              <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="42s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="200" r="130" fill="none" stroke="url(#orbGradLight)" strokeWidth="1.2" strokeDasharray="20 10">
              <animateTransform attributeName="transform" type="rotate" from="360 200 200" to="0 200 200" dur="28s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="200" r="80" fill="none" stroke="rgba(8,126,139,0.2)" strokeWidth="1" />
            
            <circle cx="200" cy="20" r="7" fill="#087E8B" style={{ filter: 'drop-shadow(0 2px 5px rgba(8,126,139,0.2))' }} />
            <circle cx="70" cy="200" r="5" fill="#6B46C1" />
            <circle cx="330" cy="260" r="6" fill="#0EA5E9" />
          </svg>
        </div>

        <div 
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1200px',
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          {/* Left-aligned Content Column */}
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              textAlign: 'left', 
              gap: '1.75rem',
              maxWidth: '650px' 
            }}
          >
            {/* Headline with Typewriter last word */}
            <h1 
              style={{ 
                fontFamily: 'Manrope, sans-serif', 
                fontSize: 'clamp(34px, 4.8vw, 68px)', 
                fontWeight: '900', 
                lineHeight: '1.15', 
                color: '#0F172A',
                letterSpacing: '-1.5px',
                margin: 0
              }}
            >
              Run your <br /> workforce on <br /> one clear <span style={{ color: '#087E8B', position: 'relative' }}>{currentText}<span className="typewriter-cursor" /></span>
            </h1>

            {/* Supporting Copy with clean space */}
            <p 
              style={{ 
                fontSize: 'clamp(16px, 1.8vw, 19px)', 
                color: '#475569', 
                lineHeight: '1.65', 
                margin: '0.5rem 0 1.25rem 0', 
                maxWidth: '560px'
              }}
            >
              A high-fidelity coordination engine for CEOs, HR officials, and employees. Build milestones, broadcast directives, and chat in absolute alignment.
            </p>

            {/* Action CTAs */}
            <div className="hero-cta-buttons">
              <button className="btn-filled" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }} onClick={() => navigate('/request-demo')}>
                Request a Demo
              </button>
              <button 
                className="btn-outline" 
                style={{ padding: '0.85rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }} 
                onClick={() => {
                  const section = document.getElementById('showroom');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Tour Portals
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT / FEATURES GRID */}
      <section 
        id="features" 
        style={{ 
          padding: '6.5rem 6vw', 
          position: 'relative',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#087E8B', fontWeight: '700', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Engineered Synergy
            </span>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2.8rem', fontWeight: '800', margin: '0.5rem 0 0 0', color: '#0F172A', letterSpacing: '-0.5px' }}>
              Designed around how teams actually interact
            </h2>
          </div>

          {/* Grid Layout of Glassmorphism Cards */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '2.25rem' 
            }}
          >
            {/* Card 1 */}
            <ScrollReveal delay={0}>
              <div className="glass-card" style={{ padding: '2.5rem 2rem', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '12px', borderRadius: '12px', background: 'rgba(8, 126, 139, 0.08)', color: '#087E8B', marginBottom: '1.5rem' }}>
                  <ListTodo size={28} />
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '700', margin: '0 0 0.75rem 0', color: '#0F172A', fontFamily: 'Manrope, sans-serif' }}>
                  Task Matrix
                </h3>
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.65', margin: 0 }}>
                  Delegate tasks instantly with deferred status controls. Comment, resolve, and update boards without UI friction.
                </p>
              </div>
            </ScrollReveal>

            {/* Card 2 */}
            <ScrollReveal delay={150}>
              <div className="glass-card" style={{ padding: '2.5rem 2rem', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.08)', color: '#3B82F6', marginBottom: '1.5rem' }}>
                  <ShieldCheck size={28} />
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '700', margin: '0 0 0.75rem 0', color: '#0F172A', fontFamily: 'Manrope, sans-serif' }}>
                  Role Isolation
                </h3>
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.65', margin: 0 }}>
                  Three unique visual workspaces. CEOs direct, HR officials organize, and employees build milestones cleanly.
                </p>
              </div>
            </ScrollReveal>

            {/* Card 3 */}
            <ScrollReveal delay={300}>
              <div className="glass-card" style={{ padding: '2.5rem 2rem', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '12px', borderRadius: '12px', background: 'rgba(8, 126, 139, 0.08)', color: '#087E8B', marginBottom: '1.5rem' }}>
                  <Megaphone size={28} />
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '700', margin: '0 0 0.75rem 0', color: '#0F172A', fontFamily: 'Manrope, sans-serif' }}>
                  Live Broadcasts
                </h3>
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.65', margin: 0 }}>
                  Broadcast workspace updates. Announce schedules, holiday releases, and structural updates to all portals instantly.
                </p>
              </div>
            </ScrollReveal>

            {/* Card 4 */}
            <ScrollReveal delay={450}>
              <div className="glass-card" style={{ padding: '2.5rem 2rem', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '12px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.08)', color: '#6B46C1', marginBottom: '1.5rem' }}>
                  <Users size={28} />
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '700', margin: '0 0 0.75rem 0', color: '#0F172A', fontFamily: 'Manrope, sans-serif' }}>
                  Team Overview
                </h3>
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.65', margin: 0 }}>
                  Keep track of team allocations, active member counts, department channels, and status tracking in real time.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. PREMIUM INTERACTIVE PORTAL SHOWROOM (The Tab Mockup Slide Show) */}
      <section 
        id="showroom" 
        style={{ 
          padding: '6.5rem 6vw', 
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid rgba(15, 23, 42, 0.05)',
          borderBottom: '1px solid rgba(15, 23, 42, 0.05)',
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#087E8B', fontWeight: '700', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Explore the Workspace
            </span>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2.8rem', fontWeight: '800', margin: '0.5rem 0 1rem 0', color: '#0F172A', letterSpacing: '-0.5px' }}>
              Three Dashboards. One System.
            </h2>
            <p style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Switch tabs below to preview the high-end dashboard interface designed specifically for each corporate tier.
            </p>
          </div>

          {/* Interactive Switch Tab Bar */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1rem', 
              marginBottom: '3rem',
              flexWrap: 'wrap'
            }}
          >
            <button 
              className={`showroom-tab ${activeTab === 'ceo' ? 'active' : ''}`}
              onClick={() => setActiveTab('ceo')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', background: 'none', color: activeTab === 'ceo' ? '#087E8B' : '#475569' }}
            >
              <LayoutDashboard size={18} />
              CEO Dashboard
            </button>
            <button 
              className={`showroom-tab ${activeTab === 'hr' ? 'active' : ''}`}
              onClick={() => setActiveTab('hr')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', background: 'none', color: activeTab === 'hr' ? '#087E8B' : '#475569' }}
            >
              <Users size={18} />
              HR Portal
            </button>
            <button 
              className={`showroom-tab ${activeTab === 'employee' ? 'active' : ''}`}
              onClick={() => setActiveTab('employee')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', background: 'none', color: activeTab === 'employee' ? '#087E8B' : '#475569' }}
            >
              <ListTodo size={18} />
              Employee Hub
            </button>
          </div>

          {/* Sliding Showroom Display Card */}
          <div 
            className="glass-card" 
            style={{ 
              padding: '3rem', 
              boxSizing: 'border-box',
              minHeight: '480px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Text description side */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '6px 14px', borderRadius: '8px', backgroundColor: 'rgba(8,126,139,0.08)', color: '#087E8B', fontSize: '0.8rem', fontWeight: '700', fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase' }}>
                {activeTab === 'ceo' ? 'Strategic Oversight' : activeTab === 'hr' ? 'Operational Control' : 'Productive Execution'}
              </div>

              {activeTab === 'ceo' && (
                <>
                  <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#0F172A', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
                    Command with total clarity
                  </h3>
                  <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
                    CEO Rajesh Kumar gets an executive bird's-eye view. Allocate tasks to HR or engineering, draft primary initiatives, broadcast crucial updates, and check global milestone completions.
                  </p>
                  <ul style={{ paddingLeft: '1.25rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0 }}>
                    <li>Direct task delegation to any department tier.</li>
                    <li>Announcements broadcast system-wide instantly.</li>
                    <li>Real-time tracking of overall completion speeds.</li>
                  </ul>
                </>
              )}

              {activeTab === 'hr' && (
                <>
                  <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#0F172A', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
                    Orchestrate resources seamlessly
                  </h3>
                  <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
                    HR Officer Pooja Sharma handles onboarding, task assignments, and employee coordination. Review pending statuses, structure direct messages, and ensure engineering remains aligned with design directives.
                  </p>
                  <ul style={{ paddingLeft: '1.25rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0 }}>
                    <li>Comprehensive employee list directory.</li>
                    <li>Onboard new corporate profiles directly.</li>
                    <li>Two-way direct messaging panel with task links.</li>
                  </ul>
                </>
              )}

              {activeTab === 'employee' && (
                <>
                  <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#0F172A', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
                    Focus, execute, and deliver
                  </h3>
                  <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
                    Employees like Alex and John focus on delivery. Receive structured queues, change statuses with deferred comments, submit queries to HR, and chat with team leads inside dedicated rooms.
                  </p>
                  <ul style={{ paddingLeft: '1.25rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0 }}>
                    <li>Personalized task boards focused on targets.</li>
                    <li>Deferred status changes that update only on "Post".</li>
                    <li>Integrated chat room connections for team channels.</li>
                  </ul>
                </>
              )}
            </div>

            {/* Interactive Mockup Side */}
            <div 
              style={{ 
                background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)', 
                border: '1px solid rgba(15,23,42,0.08)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                minHeight: '320px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative'
              }}
            >
              {/* Window Controls */}
              <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid rgba(15,23,42,0.06)', paddingBottom: '0.75rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'IBM Plex Mono, monospace', marginLeft: 'auto' }}>orbit_client_v1.2</span>
              </div>

              {activeTab === 'ceo' && (
                <>
                  <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A' }}>Rajesh Kumar (CEO)</span>
                    <span style={{ fontSize: '0.75rem', color: '#087E8B', background: 'rgba(8,126,139,0.08)', padding: '2px 8px', borderRadius: '4px' }}>Executive Portal</span>
                  </div>
                  {/* Task Widget Mockup */}
                  <div style={{ border: '1px solid rgba(15,23,42,0.06)', backgroundColor: 'rgba(0,0,0,0.01)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '700', color: '#0F172A' }}>Task: DB Migration Phase 2</span>
                      <span style={{ color: '#EF4444', fontWeight: '600' }}>High</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#475569' }}>Assignee: Alex Carter</span>
                      <span style={{ color: '#087E8B', background: 'rgba(8,126,139,0.08)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>Pending Review</span>
                    </div>
                  </div>
                  {/* Announcement Builder Widget */}
                  <div style={{ border: '1px solid rgba(15,23,42,0.06)', backgroundColor: 'rgba(0,0,0,0.01)', borderRadius: '10px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>Draft Broadcast:</span>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '6px', border: '1px solid rgba(15,23,42,0.04)', borderRadius: '6px', color: '#334155', fontSize: '0.75rem' }}>
                      Annual performance reviews kick off next Monday.
                    </div>
                    <button style={{ alignSelf: 'flex-end', background: '#087E8B', border: 'none', color: '#fff', fontSize: '0.7rem', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>Broadcast Live</button>
                  </div>
                </>
              )}

              {activeTab === 'hr' && (
                <>
                  <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A' }}>Pooja Sharma (HR)</span>
                    <span style={{ fontSize: '0.75rem', color: '#6B46C1', background: 'rgba(107,70,193,0.08)', padding: '2px 8px', borderRadius: '4px' }}>Human Resources</span>
                  </div>
                  {/* Onboarding Widget Mockup */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>Active Employees:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', borderBottom: '1px solid rgba(15,23,42,0.05)', fontSize: '0.8rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                      <span style={{ color: '#0F172A' }}>Alex Carter</span>
                      <span style={{ fontSize: '0.7rem', color: '#475569', marginLeft: 'auto' }}>Software Eng.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', borderBottom: '1px solid rgba(15,23,42,0.05)', fontSize: '0.8rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                      <span style={{ color: '#0F172A' }}>John Doe</span>
                      <span style={{ fontSize: '0.7rem', color: '#475569', marginLeft: 'auto' }}>Frontend Dev.</span>
                    </div>
                  </div>
                  {/* Chat interface mock */}
                  <div style={{ border: '1px solid rgba(15,23,42,0.06)', backgroundColor: 'rgba(0,0,0,0.01)', borderRadius: '10px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '6px', color: '#3B82F6', fontWeight: '700' }}>
                      <MessageSquare size={12} />
                      <span>Direct Chat (Rajesh Kumar)</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ alignSelf: 'flex-start', background: 'rgba(0,0,0,0.04)', padding: '6px 10px', borderRadius: '8px 8px 8px 0', color: '#334155' }}>
                        Hi Pooja, did the new engineering tasks sync?
                      </div>
                      <div style={{ alignSelf: 'flex-end', background: '#087E8B', padding: '6px 10px', borderRadius: '8px 8px 0 8px', color: '#fff' }}>
                        Yes Rajesh, all set in database.
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'employee' && (
                <>
                  <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A' }}>Alex Carter (Developer)</span>
                    <span style={{ fontSize: '0.75rem', color: '#10B981', background: 'rgba(16,185,129,0.08)', padding: '2px 8px', borderRadius: '4px' }}>Employee Portal</span>
                  </div>
                  {/* Task details modal change mock */}
                  <div style={{ border: '1px solid rgba(15,23,42,0.06)', backgroundColor: 'rgba(0,0,0,0.01)', borderRadius: '10px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>Update Status (Deferred Save)</span>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ color: '#475569' }}>Status:</span>
                      <select defaultValue="in_progress" style={{ background: '#fff', color: '#0F172A', border: '1px solid rgba(15,23,42,0.1)', padding: '4px', borderRadius: '4px', outline: 'none' }}>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div style={{ backgroundColor: '#fff', border: '1px solid rgba(15,23,42,0.08)', padding: '6px', borderRadius: '6px', color: '#94A3B8' }}>
                      Add comment here before posting...
                    </div>
                    <button style={{ alignSelf: 'flex-end', background: 'linear-gradient(135deg, #087E8B, #06B6D4)', border: 'none', color: '#fff', fontWeight: '600', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}>Post & Submit</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE ORBIT LOOP STEP-BY-STEP (How It Works) */}
      <section 
        id="how-it-works" 
        style={{ 
          padding: '6.5rem 6vw', 
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#087E8B', fontWeight: '700', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              The Synchronization Flow
            </span>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2.8rem', fontWeight: '800', margin: '0.5rem 0 0 0', color: '#0F172A', letterSpacing: '-0.5px' }}>
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
              gap: '2.5rem'
            }}
          >
            {/* Connecting Divider Line (Desktop only) */}
            <div 
              className="desktop-only-divider"
              style={{
                position: 'absolute',
                top: '36px',
                left: '16.67%',
                width: '66.67%',
                height: '2px',
                background: 'linear-gradient(90deg, #087E8B, #6B46C1, #0EA5E9)',
                opacity: 0.25,
                zIndex: 0
              }}
            />

            {/* Step 1 */}
            <div style={{ flex: 1, minWidth: '280px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div 
                style={{ 
                  width: '72px', 
                  height: '72px', 
                  borderRadius: '50%', 
                  backgroundColor: '#FFFFFF', 
                  border: '2px solid #087E8B', 
                  color: '#087E8B', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1.75rem auto',
                  fontSize: '1.4rem',
                  fontWeight: '800',
                  boxShadow: '0 4px 15px rgba(8, 126, 139, 0.1)',
                  fontFamily: 'IBM Plex Mono, monospace'
                }}
              >
                01
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#0F172A', fontFamily: 'Manrope, sans-serif' }}>
                Sign In to Portal
              </h3>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.65', padding: '0 1rem', margin: 0 }}>
                Choose your specific role dashboard shortcut or log in using your secure database key credentials.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ flex: 1, minWidth: '280px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div 
                style={{ 
                  width: '72px', 
                  height: '72px', 
                  borderRadius: '50%', 
                  backgroundColor: '#FFFFFF', 
                  border: '2px solid #6B46C1', 
                  color: '#6B46C1', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1.75rem auto',
                  fontSize: '1.4rem',
                  fontWeight: '800',
                  boxShadow: '0 4px 15px rgba(107, 70, 193, 0.1)',
                  fontFamily: 'IBM Plex Mono, monospace'
                }}
              >
                02
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#0F172A', fontFamily: 'Manrope, sans-serif' }}>
                Orchestrate Tasks
              </h3>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.65', padding: '0 1rem', margin: 0 }}>
                Generate work objectives, assign targets to team profiles, view board columns, and leave comments.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ flex: 1, minWidth: '280px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div 
                style={{ 
                  width: '72px', 
                  height: '72px', 
                  borderRadius: '50%', 
                  backgroundColor: '#FFFFFF', 
                  border: '2px solid #0EA5E9', 
                  color: '#0EA5E9', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1.75rem auto',
                  fontSize: '1.4rem',
                  fontWeight: '800',
                  boxShadow: '0 4px 15px rgba(14, 165, 233, 0.1)',
                  fontFamily: 'IBM Plex Mono, monospace'
                }}
              >
                03
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#0F172A', fontFamily: 'Manrope, sans-serif' }}>
                Track Real-Time Progress
              </h3>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.65', padding: '0 1rem', margin: 0 }}>
                Collect completed items, resolve queries, broadcast announcements, and review task summaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (Accordion) */}
      <section 
        style={{ 
          padding: '5rem 6vw', 
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid rgba(15, 23, 42, 0.05)',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#087E8B', fontWeight: '700', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Common Queries
            </span>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0 0 0', color: '#0F172A' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                q: "What makes OrbitWorks different from standard task boards?",
                a: "Unlike generic task lists, OrbitWorks is tailored around 3 isolated role-based portals (CEO, HR, Employee) that are connected at the database level. Actions on one portal immediately update target objectives and feeds on the other portals."
              },
              {
                q: "Does the direct chat support history logs?",
                a: "Yes, our chat system uses a dual engine: Socket.io for instantaneous real-time delivery and MongoDB for storing message logs, allowing you to view and retrieve past messages from any dashboard."
              },
              {
                q: "How does task resolution work?",
                a: "Employees can modify a task status and append a descriptive comment. However, to prevent premature submissions, changes are cached locally and committed only after clicking the submission submit button."
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="glass-card" 
                style={{ 
                  padding: '1.25rem 1.75rem', 
                  cursor: 'pointer',
                  borderRadius: '14px',
                  backgroundColor: openFaq === idx ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.8)',
                  borderColor: openFaq === idx ? 'rgba(8,126,139,0.3)' : 'rgba(15, 23, 42, 0.08)'
                }}
                onClick={() => toggleFaq(idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F172A' }}>{item.q}</span>
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      color: '#087E8B', 
                      transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                </div>
                <div 
                  style={{ 
                    maxHeight: openFaq === idx ? '200px' : '0px', 
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: openFaq === idx ? 1 : 0,
                    marginTop: openFaq === idx ? '0.75rem' : '0px'
                  }}
                >
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.98rem', lineHeight: '1.65' }}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ABOUT / MISSION SECTION */}
      <section 
        id="about" 
        style={{ 
          padding: '6rem 6vw 7.5rem 6vw', 
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: '#087E8B', fontWeight: '700', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Our Mission
          </span>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2.8rem', fontWeight: '800', margin: '0.5rem 0 1.5rem 0', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Simplifying alignment across corporate tiers
          </h2>
          <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: '1.75', margin: '0 0 2rem 0' }}>
            OrbitWorks was created to bridge the communication gaps between executive visionaries, administrative coordinators, and front-line executers. By building structured roles that seamlessly feed tasks, announcements, and progress logs to one another, OrbitWorks turns standard corporate friction into one single clear flow of momentum.
          </p>
          <div style={{ paddingTop: '2rem', display: 'flex', justifyContent: 'center', gap: '4rem' }}>
            <div>
              <h4 style={{ margin: '0 0 0.2rem 0', color: '#0F172A', fontSize: '1.25rem', fontWeight: '800' }}>2026</h4>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'IBM Plex Mono, monospace' }}>Project Founded</p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.2rem 0', color: '#0F172A', fontSize: '1.25rem', fontWeight: '800' }}>100%</h4>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'IBM Plex Mono, monospace' }}>Open Workspace</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer 
        style={{ 
          textAlign: 'center', 
          padding: '2rem 6vw', 
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid rgba(15, 23, 42, 0.05)',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.85rem',
          fontWeight: '600',
          color: '#475569',
          marginTop: 'auto',
          boxSizing: 'border-box',
          letterSpacing: '0.03em',
          position: 'relative',
          zIndex: 5
        }}
      >
        <div style={{ marginBottom: '0.8rem' }}>
          © 2026 OrbitWorks · {' '}
          <a 
            href="/privacy" 
            onClick={(e) => { e.preventDefault(); alert('Privacy Policy placeholder'); }}
            style={{ color: '#087E8B', textDecoration: 'none', fontWeight: '700', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.target.style.color = '#0F172A'}
            onMouseOut={(e) => e.target.style.color = '#087E8B'}
          >
            Privacy Policy
          </a>
          {' '}·{' '}
          <a 
            href="/terms" 
            onClick={(e) => { e.preventDefault(); alert('Terms of Service placeholder'); }}
            style={{ color: '#087E8B', textDecoration: 'none', fontWeight: '700', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.target.style.color = '#0F172A'}
            onMouseOut={(e) => e.target.style.color = '#087E8B'}
          >
            Terms of Service
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: '#475569', 
              transition: 'all 0.2s', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1px solid rgba(15, 23, 42, 0.1)',
              backgroundColor: 'rgba(15, 23, 42, 0.02)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#087E8B';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#087E8B';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.02)';
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.1)';
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
              color: '#475569', 
              transition: 'all 0.2s', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1px solid rgba(15, 23, 42, 0.1)',
              backgroundColor: 'rgba(15, 23, 42, 0.02)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#087E8B';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#087E8B';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.02)';
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.1)';
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
              color: '#475569', 
              transition: 'all 0.2s', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1px solid rgba(15, 23, 42, 0.1)',
              backgroundColor: 'rgba(15, 23, 42, 0.02)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#087E8B';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#087E8B';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.02)';
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.1)';
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

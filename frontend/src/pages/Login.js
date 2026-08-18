import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import picLogo from '../assets/pic.png';
import * as THREE from 'three';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldAlert,
  ArrowRight,
  Crown,
  User,
  Users
} from 'lucide-react';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [demoMode] = useState(false);

  const [hasWebGL, setHasWebGL] = useState(true);
  const [entranceStep, setEntranceStep] = useState(0);

  // Dynamic Google Font Loader
  useEffect(() => {
    const link1 = document.createElement('link');
    link1.rel = 'preconnect';
    link1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    document.head.appendChild(link2);

    const link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Manrope:wght@800;900&display=swap';
    document.head.appendChild(link3);

    // Staggered entrance animation delays
    const timer1 = setTimeout(() => setEntranceStep(1), 100);  // Workspace label
    const timer2 = setTimeout(() => setEntranceStep(2), 170);  // Eyebrow
    const timer3 = setTimeout(() => setEntranceStep(3), 240);  // Headline
    const timer4 = setTimeout(() => setEntranceStep(4), 310);  // Description
    const timer5 = setTimeout(() => setEntranceStep(5), 380);  // Right Card container
    const timer6 = setTimeout(() => setEntranceStep(6), 450);  // Logo & Header
    const timer7 = setTimeout(() => setEntranceStep(7), 520);  // Username Input group
    const timer8 = setTimeout(() => setEntranceStep(8), 590);  // Password Input group
    const timer9 = setTimeout(() => setEntranceStep(9), 660);  // Remember me & Forgot password
    const timer10 = setTimeout(() => setEntranceStep(10), 730); // Sign-in Button

    // WebGL capability check
    try {
      const canvas = document.createElement('canvas');
      setHasWebGL(!!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))));
    } catch (e) {
      setHasWebGL(false);
    }

    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
      document.head.removeChild(link3);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
      clearTimeout(timer8);
      clearTimeout(timer9);
      clearTimeout(timer10);
    };
  }, []);

  // Three.js Live Orbital Visualization
  useEffect(() => {
    if (!hasWebGL) return;
    const canvas = document.getElementById('login-3d-canvas');
    if (!canvas) return;

    let width = canvas.parentElement.clientWidth;
    let height = canvas.parentElement.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.4;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Root group for the entire orbital system
    const orbitalGroup = new THREE.Group();
    scene.add(orbitalGroup);

    // 1. Sparse central particle sphere (520 particles)
    const particleCount = 520;
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      // Constrained to the shell surface boundary (1.40 - 1.48 units) for a hollow spherical outline
      const r = 1.40 + Math.random() * 0.08; 

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom circle texture for particles
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const ctx = pCanvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(8, 8, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#4AA9E8'; // Use light blue color (#4AA9E8)
    ctx.fill();
    const pTexture = new THREE.CanvasTexture(pCanvas);
    pTexture.needsUpdate = true;

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.085, // Increased size to make them clearly visible
      map: pTexture,
      transparent: true,
      opacity: 0.82,
      depthWrite: false
    });

    const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
    orbitalGroup.add(pointCloud); // Nested inside orbitalGroup to rotate on same axis

    // 2. Three thin elliptical rings (using TorusGeometry + Scale axes for ellipses)
    const createRing = (radius, colorHex, opacity) => {
      // Tube thickness set to 0.01 (falls precisely within requested 0.008–0.012 specification)
      const geometry = new THREE.TorusGeometry(radius, 0.01, 8, 120);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorHex),
        transparent: true,
        opacity: opacity,
        depthWrite: false
      });
      const torus = new THREE.Mesh(geometry, material);
      return torus;
    };

    const ring1 = createRing(1.66, 0x7BCFC7, 0.65); // soft mint teal
    ring1.scale.set(1.0, 0.85, 1.0);
    ring1.rotation.set(0, 0, 0);

    const ring2 = createRing(1.90, 0x1769E0, 0.72); // electric blue
    ring2.scale.set(1.0, 0.88, 1.0);
    ring2.rotation.set(0.52, 0.38, 0.25);

    const ring3 = createRing(2.18, 0x7BCFC7, 0.60); // soft teal
    ring3.scale.set(1.0, 0.86, 1.0);
    ring3.rotation.set(1.04, 0.76, 0.50);

    orbitalGroup.add(ring1);
    orbitalGroup.add(ring2);
    orbitalGroup.add(ring3);

    // Mouse tilt tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      targetX = (e.clientX / window.innerWidth) - 0.5;
      targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Reduced motion configuration
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speedMultiplier = prefersReducedMotion ? 0.1 : 1.0;

    let frameId = null;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Mouse interactive tilt offsets
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Calculate time phase scale
      const time = performance.now();
      const timePhase = time * speedMultiplier;

      // 16-second full period (8 seconds forward, 8 seconds backward)
      const period = 16000;
      const progress = (timePhase % period) / period;
      const limit = 0.168; // Swing limit to match exactly 0.0007 rad/frame velocity

      let autoY = 0;
      if (progress < 0.5) {
        autoY = -limit + (progress * 4 * limit); // linear forward sweep
      } else {
        autoY = limit - ((progress - 0.5) * 4 * limit); // linear reverse sweep
      }

      // Float animation wave calculations (subtle X-axis floating motion)
      const floatX = Math.sin(timePhase * 0.0002) * 0.08;

      // Apply coordinates
      orbitalGroup.rotation.y = autoY + (currentX * 0.25);
      orbitalGroup.rotation.x = floatX + (currentY * 0.25);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      pTexture.dispose();
      renderer.dispose();
    };
  }, [hasWebGL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      const role = (user.role || '').toLowerCase();
      if (role === 'ceo') navigate('/ceo');
      else if (role === 'hr') navigate('/hr');
      else navigate('/employee');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const handleDemoLogin = async (roleType) => {
    setError('');
    let demoEmail = '';
    if (roleType === 'ceo') demoEmail = 'ceo@orbitworks.com';
    else if (roleType === 'hr') demoEmail = 'hr@orbitworks.com';
    else demoEmail = 'rohan@orbitworks.com';

    setEmail(demoEmail);
    setPassword('password');

    try {
      const user = await login(demoEmail, 'password');
      const role = (user.role || '').toLowerCase();
      if (role === 'ceo') navigate('/ceo');
      else if (role === 'hr') navigate('/hr');
      else navigate('/employee');
    } catch (err) {
      setError('Demo login failed');
    }
  };

  // WebGL Fallback SVG renderer
  const renderFallbackSVG = () => (
    <svg 
      viewBox="0 0 400 400" 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0,
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="50" fill="#087E8B" opacity="0.12" />
      <ellipse cx="200" cy="200" rx="90" ry="76" fill="none" stroke="#7BCFC7" strokeWidth="1" opacity="0.65" transform="rotate(10 200 200)" />
      <ellipse cx="200" cy="200" rx="104" ry="81" fill="none" stroke="#1769E0" strokeWidth="1" opacity="0.72" transform="rotate(35 200 200)" />
      <ellipse cx="200" cy="200" rx="120" ry="92" fill="none" stroke="#7BCFC7" strokeWidth="1" opacity="0.58" transform="rotate(-15 200 200)" />
      <circle cx="170" cy="180" r="3" fill="#087E8B" opacity="0.7" />
      <circle cx="230" cy="210" r="3" fill="#1769E0" opacity="0.75" />
      <circle cx="205" cy="145" r="2" fill="#7BCFC7" opacity="0.65" />
    </svg>
  );

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh', 
        width: '100vw', 
        backgroundColor: '#F4F7F5', // Off-white paper background
        overflowX: 'hidden',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* 1. Global CSS Style declarations */}
      <style>{`
        /* Staggered entry animation utilities */
        .stagger-item {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 720ms cubic-bezier(0.16, 1, 0.3, 1), transform 720ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stagger-item.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .role-badge-wrapper {
          position: absolute;
          z-index: 2;
          pointer-events: auto;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(8, 126, 139, 0.16);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          font-weight: 600;
          color: #102A43;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .role-badge:hover {
          border-color: rgba(8, 126, 139, 0.45);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 6px 16px rgba(8, 126, 139, 0.08);
          transform: translateY(-1px) scale(1.02);
        }
        .help-center-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #526579;
          text-decoration: none;
          transition: color 0.2s ease;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .help-center-link:hover {
          color: #087E8B;
        }

        .login-input-field {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 2.5rem;
          font-size: 1.05rem;
          border-radius: 8px;
          border: 1px solid #D5E1E5;
          outline: none;
          background-color: #ffffff;
          box-sizing: border-box;
          color: #102A43;
          font-family: 'IBM Plex Sans', sans-serif;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .login-input-field:focus {
          border-color: #087E8B;
          box-shadow: 0 0 0 4px rgba(8, 126, 139, 0.12), 0 4px 12px rgba(8, 126, 139, 0.04);
          transform: translateY(-0.5px);
        }

        .login-submit-btn {
          padding: 0.82rem;
          width: 100%;
          font-size: 1.05rem;
          font-weight: 600;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #087E8B 0%, #1769E0 100%);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 16px rgba(8, 126, 139, 0.22);
        }
        .login-submit-btn:hover:not(:disabled) {
          transform: translateY(-1.5px) scale(1.01);
          box-shadow: 0 6px 24px rgba(23, 105, 224, 0.32);
          filter: brightness(1.06);
        }
        .login-submit-btn:active:not(:disabled) {
          transform: translateY(0.5px) scale(0.99);
        }
        .login-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .demo-login-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 0.55rem 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #102A43;
          background-color: #ffffff;
          border: 1px solid #D5E1E5;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .demo-login-btn:hover {
          background-color: #F4F7F5;
          border-color: #087E8B;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(8, 126, 139, 0.05);
        }
        .demo-login-btn:active {
          transform: translateY(0);
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          cursor: pointer;
        }
        .logo-img {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .logo-container:hover .logo-img {
          transform: scale(1.08) rotate(8deg);
        }
        
        .login-split-layout {
          display: flex;
          flex: 1;
          width: 100%;
          padding-top: 80px; /* Header spacing offsets */
          box-sizing: border-box;
        }

        .login-left-hero {
          flex: 1.1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 4.5rem 5vw 4.5rem 5vw;
          position: relative;
          box-sizing: border-box;
        }

        .login-right-empty {
          flex: 0.9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 5vw;
          box-sizing: border-box;
        }

        @media (max-width: 900px) {
          .login-split-layout {
            flex-direction: column;
            padding-top: 76px;
          }
          .login-left-hero {
            flex: none;
            padding: 3rem 1.5rem;
            min-height: auto;
          }
          .login-right-empty {
            flex: none;
            padding: 2rem 1.5rem 4rem 1.5rem;
          }
          .desktop-canvas-container {
            height: 320px !important;
            position: relative !important;
            margin-bottom: 1.5rem;
          }
          .desktop-only-divider {
            display: none !important;
          }
        }
      `}</style>

      {/* TOP NAVIGATION BAR */}
      <header 
        style={{ 
          height: '78px',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #D5E1E5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 5vw',
          boxSizing: 'border-box',
          zIndex: 10
        }}
      >
        {/* Wordmark logo */}
        <div className="logo-container">
          <img className="logo-img" src={picLogo} alt="Logo" />
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-0.6px' }}>
            <span style={{ color: '#102A43' }}>orbit</span>
            <span style={{ color: '#087E8B' }}>works</span>
          </span>
        </div>

      </header>

      {/* CORE WORKSPACE SPLIT LAYOUT */}
      <main className="login-split-layout">
        
        {/* LEFT PROFILE HERO & THREE.JS VISUALIZER */}
        <section className="login-left-hero" aria-label="Orbit Works Platform Introduction">
          
          {/* Three.js Canvas or SVG Fallback Container wrapper */}
          <div 
            className="desktop-canvas-container"
            style={{ 
              position: 'absolute', 
              top: '5%', 
              left: 0, 
              width: '100%', 
              height: '90%', 
              zIndex: 0, 
              pointerEvents: 'none' 
            }}
          >
            {hasWebGL ? (
              <canvas id="login-3d-canvas" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true" />
            ) : renderFallbackSVG()}

            {/* Constellation Style Monospace Coordinate badges overlay */}
            <div className="role-badge-wrapper" style={{ top: '15%', left: '73%' }}>
              <div className="role-badge">
                <Crown size={11} style={{ color: '#087E8B' }} />
                CEO / vision
              </div>
            </div>
            <div className="role-badge-wrapper" style={{ top: '63%', left: '72%' }}>
              <div className="role-badge">
                <Users size={11} style={{ color: '#1769E0' }} />
                HR / people
              </div>
            </div>
            <div className="role-badge-wrapper" style={{ top: '88%', left: '34%' }}>
              <div className="role-badge">
                <User size={11} style={{ color: '#7BCFC7' }} />
                Employee / growth
              </div>
            </div>
          </div>

          {/* Spacer layout offset */}
          <div style={{ height: '1rem', zIndex: 1 }} />

          {/* Core Title and Supporting copy (Vertical Center Offset) */}
          <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: 'auto 0 4rem 0' }}>
            
            {/* Eyebrow Label */}
            <div 
              className={`stagger-item ${entranceStep >= 2 ? 'visible' : ''}`}
              style={{ color: '#087E8B', fontSize: '0.85rem', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.08em', fontWeight: '700' }}
            >
              THE WORKPLACE IN MOTION
            </div>
            
            {/* Main Headline */}
            <h1 
              className={`stagger-item ${entranceStep >= 3 ? 'visible' : ''}`}
              style={{ 
                fontFamily: 'Manrope, sans-serif', 
                fontSize: 'clamp(52px, 6vw, 84px)', 
                fontWeight: '900', 
                lineHeight: '0.93', 
                color: '#102A43', 
                margin: 0, 
                letterSpacing: '-1.8px' 
              }}
            >
              Move work <br />
              <span style={{ color: '#087E8B' }}>forward.</span>
            </h1>

            {/* Supporting Copy */}
            <p 
              className={`stagger-item ${entranceStep >= 4 ? 'visible' : ''}`}
              style={{ 
                fontFamily: 'IBM Plex Sans, sans-serif', 
                fontSize: '1.15rem', 
                color: '#526579', 
                lineHeight: '1.65', 
                margin: '1rem 0 0 0', 
                maxWidth: '400px' 
              }}
            >
              One clear orbit for every team, task, and tiny win that keeps your company moving.
            </p>
          </div>

          {/* Empty Space at Bottom left pane for offset balance */}
          <div style={{ height: '1rem' }} />
        </section>

        {/* RIGHT PANE - Floating Credentials Sign-In Box (Unchanged functional layout) */}
        <div className="login-right-empty">
          <div 
            className={`stagger-item ${entranceStep >= 5 ? 'visible' : ''}`}
            style={{ 
              position: 'relative', 
              zIndex: 1, 
              width: '100%', 
              maxWidth: '410px', 
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '24px', 
              boxShadow: '0 24px 60px rgba(11, 27, 43, 0.08), 0 8px 16px rgba(11, 27, 43, 0.02)', 
              border: '1px solid rgba(255, 255, 255, 0.6)', 
              padding: '2.75rem 2.25rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.4rem', 
              boxSizing: 'border-box'
            }}
          >
            <div className={`stagger-item ${entranceStep >= 6 ? 'visible' : ''}`}>
              {/* Logo & Headline */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <div className="logo-container">
                  <img className="logo-img" src={picLogo} alt="Logo" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#102A43', letterSpacing: '-0.3px', fontFamily: 'Manrope, sans-serif' }}>
                    orbit<span style={{ color: '#087E8B' }}>works</span>
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#526579', fontWeight: '700', letterSpacing: '0.08em', fontFamily: 'IBM Plex Mono, monospace', marginTop: '0.3rem' }}>
                  Workforce Portal
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem', textAlign: 'center', marginTop: '1.2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0, letterSpacing: '0.02em', color: '#102A43', fontFamily: 'Manrope, sans-serif' }}>WELCOME BACK</h3>
                <p style={{ fontSize: '0.95rem', color: '#526579', margin: 0, fontFamily: 'IBM Plex Sans, sans-serif' }}>
                  Sign in to continue to your dashboard
                </p>
              </div>
            </div>

            {error && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  backgroundColor: '#FFF5F5', 
                  color: '#C53030', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid #FEB2B2', 
                  fontSize: '0.85rem' 
                }}
              >
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={`stagger-item ${entranceStep >= 7 ? 'visible' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#102A43', fontFamily: 'IBM Plex Sans, sans-serif' }}>Username</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter email or username" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input-field"
                  />
                  <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#526579' }} size={16} />
                </div>
              </div>

              <div className={`stagger-item ${entranceStep >= 8 ? 'visible' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#102A43', fontFamily: 'IBM Plex Sans, sans-serif' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="Enter password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input-field"
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#526579' }} size={16} />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: 'none', 
                      border: 'none', 
                      color: '#526579', 
                      cursor: 'pointer', 
                      padding: 0, 
                      display: 'flex', 
                      alignItems: 'center',
                      zIndex: 3
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className={`stagger-item ${entranceStep >= 9 ? 'visible' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)} 
                    style={{ width: 'auto', padding: 0, cursor: 'pointer' }}
                  />
                  <span style={{ color: '#526579' }}>Remember me</span>
                </label>
                <a 
                  href="/forgot-password" 
                  onClick={(e) => { e.preventDefault(); alert('Forgot Password functionality placeholder'); }} 
                  style={{ color: '#526579', textDecoration: 'none', fontWeight: '500' }}
                >
                  Forgot password?
                </a>
              </div>

              <div className={`stagger-item ${entranceStep >= 10 ? 'visible' : ''}`}>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="login-submit-btn"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </form>

            {/* DEMO MODE TRIGGERS */}
            {demoMode && (
              <div 
                style={{ 
                  backgroundColor: '#F4F7F5',
                  borderRadius: '10px', 
                  padding: '0.85rem 1rem', 
                  marginTop: '0.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.6rem',
                  border: '1px dashed #D5E1E5'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: '#526579', fontWeight: '700', fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Quick Access Shortcuts
                  </span>
                  <span style={{ fontSize: '0.6rem', color: '#087E8B', fontWeight: '600', backgroundColor: 'rgba(8, 126, 139, 0.08)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>
                    DEMO
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleDemoLogin('ceo')} 
                    className="demo-login-btn"
                  >
                    <Crown size={12} style={{ color: '#087E8B' }} />
                    CEO
                  </button>
                  <button 
                    onClick={() => handleDemoLogin('hr')} 
                    className="demo-login-btn"
                  >
                    <User size={12} style={{ color: '#1769E0' }} />
                    HR
                  </button>
                  <button 
                    onClick={() => handleDemoLogin('employee')} 
                    className="demo-login-btn"
                  >
                    <User size={12} style={{ color: '#7BCFC7' }} />
                    Employee
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* FOOTER TRUST ELEMENT */}
      <footer 
        style={{ 
          textAlign: 'center', 
          padding: '1.25rem 1rem', 
          backgroundColor: '#ffffff',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          fontFamily: 'IBM Plex Sans, sans-serif',
          fontSize: '0.85rem',
          fontWeight: '600',
          color: '#526579',
          marginTop: 'auto',
          zIndex: 5,
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
      </footer>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import picLogo from '../assets/pic.png';
import { CheckCircle2, ChevronRight } from 'lucide-react';

const RequestDemo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Enter your first name';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Enter your last name';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Enter your work email address';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Enter a valid email address';
      }
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Enter your company name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
    }
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        backgroundColor: '#F4F7F5',
        fontFamily: 'IBM Plex Sans, sans-serif' 
      }}
    >
      <style>{`
        .demo-input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          border-radius: 8px;
          border: 1px solid #D5E1E5;
          outline: none;
          background-color: #ffffff;
          box-sizing: border-box;
          color: #102A43;
          font-family: 'IBM Plex Sans', sans-serif;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .demo-input-field:focus {
          border-color: #087E8B;
          box-shadow: 0 0 0 3px rgba(8, 126, 139, 0.15);
        }

        .demo-input-field.error-border {
          border-color: #E53E3E;
        }

        .oval-back-btn {
          padding: 6px 18px;
          border-radius: 999px;
          border: 1.5px solid #D5E1E5;
          backgroundColor: #ffffff;
          color: #526579;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          font-family: 'IBM Plex Sans', sans-serif;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .oval-back-btn:hover {
          border-color: #087E8B;
          color: #087E8B;
          background-color: rgba(8, 126, 139, 0.04);
          transform: translateY(-1px);
        }

        .oval-back-btn:active {
          transform: translateY(0);
        }

        .submit-btn {
          padding: 0.8rem;
          width: 100%;
          font-size: 0.95rem;
          font-weight: 600;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #087E8B;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(8, 126, 139, 0.15);
        }

        .submit-btn:hover {
          background-color: #0b6c77;
          transform: scale(1.015);
          box-shadow: 0 6px 20px rgba(8, 126, 139, 0.25);
        }

        .submit-btn:active {
          transform: scale(0.99);
        }

        .error-message {
          color: #E53E3E;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          font-weight: 500;
        }
      `}</style>

      {/* Header */}
      <header 
        style={{ 
          height: '78px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #D5E1E5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 5vw',
          boxSizing: 'border-box'
        }}
      >
        <div 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
        >
          <img src={picLogo} alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-0.6px' }}>
            <span style={{ color: '#102A43' }}>orbit</span>
            <span style={{ color: '#087E8B' }}>works</span>
          </span>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="oval-back-btn"
        >
          Back to Home
        </button>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div 
          style={{ 
            width: '100%', 
            maxWidth: '520px', 
            backgroundColor: '#ffffff', 
            borderRadius: '16px', 
            border: '1px solid rgba(0,0,0,0.06)', 
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)', 
            padding: '3rem 2.5rem',
            boxSizing: 'border-box'
          }}
        >
          {!submitted ? (
            <>
              {/* Headline */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2rem', fontWeight: '900', margin: '0 0 0.5rem 0', color: '#102A43', letterSpacing: '-0.5px' }}>
                  Request a Demo
                </h2>
                <p style={{ color: '#526579', fontSize: '0.9rem', margin: 0 }}>
                  Enter your details below to schedule a tailored live demo walk.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Row: First Name & Last Name */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#102A43' }}>First Name *</label>
                    <input 
                      type="text" 
                      name="firstName"
                      placeholder=""
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`demo-input-field ${errors.firstName ? 'error-border' : ''}`}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>

                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#102A43' }}>Last Name *</label>
                    <input 
                      type="text" 
                      name="lastName"
                      placeholder=""
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`demo-input-field ${errors.lastName ? 'error-border' : ''}`}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>

                {/* Field: Work Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#102A43' }}>Work Email *</label>
                  <input 
                    type="text" 
                    name="email"
                    placeholder=""
                    value={formData.email}
                    onChange={handleChange}
                    className={`demo-input-field ${errors.email ? 'error-border' : ''}`}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                {/* Field: Company Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#102A43' }}>Company Name *</label>
                  <input 
                    type="text" 
                    name="companyName"
                    placeholder=""
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`demo-input-field ${errors.companyName ? 'error-border' : ''}`}
                  />
                  {errors.companyName && <span className="error-message">{errors.companyName}</span>}
                </div>

                {/* Field: Phone Number (Optional) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#102A43' }}>Phone Number (Optional)</label>
                  <input 
                    type="text" 
                    name="phone"
                    placeholder=""
                    value={formData.phone}
                    onChange={handleChange}
                    className="demo-input-field"
                  />
                </div>

                {/* Field: Message (Optional) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#102A43' }}>Message / What are you looking to explore?</label>
                  <textarea 
                    name="message"
                    rows={4}
                    placeholder="Tell us about your team size, tasks, or coordination goals..."
                    value={formData.message}
                    onChange={handleChange}
                    className="demo-input-field"
                    style={{ resize: 'vertical', minHeight: '80px' }}
                  />
                </div>

                {/* Submit button */}
                <button type="submit" className="submit-btn">
                  Request a Demo
                  <ChevronRight size={16} />
                </button>

              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(8, 126, 139, 0.08)', color: '#087E8B', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={44} />
              </div>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2rem', fontWeight: '900', margin: '0 0 0.75rem 0', color: '#102A43', letterSpacing: '-0.5px' }}>
                Thanks!
              </h2>
              <p style={{ color: '#526579', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 2rem 0' }}>
                We've received your request. We'll be in touch soon.
              </p>
              <button
                onClick={() => navigate('/')}
                className="submit-btn"
                style={{ width: 'auto', display: 'inline-flex', padding: '0.8rem 2rem' }}
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RequestDemo;

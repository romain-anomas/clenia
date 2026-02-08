import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login(formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Success animation before redirect
            setTimeout(() => {
                navigate('/parking-records');
            }, 800);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Animated Background */}
            <div className="animated-bg">
                <div className="gradient-sphere sphere-1"></div>
                <div className="gradient-sphere sphere-2"></div>
                <div className="gradient-sphere sphere-3"></div>
                <div className="particles">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className={`particle particle-${i + 1}`}></div>
                    ))}
                </div>
            </div>

            {/* Glass Card */}
            <div className="login-card">
                {/* Logo Section */}
                <div className="logo-section">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h1 className="brand-name">SmartPark</h1>
                    <p className="brand-tagline">Parking Space Sales Management System</p>
                    <div className="location-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>Rubavu District, Western Province</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Username Field */}
                    <div className={`input-group ${focusedField === 'username' ? 'focused' : ''} ${formData.username ? 'has-value' : ''}`}>
                        <div className="input-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="username"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                        />
                        <label htmlFor="username" className="floating-label">Username</label>
                        <div className="input-line"></div>
                    </div>

                    {/* Password Field */}
                    <div className={`input-group ${focusedField === 'password' ? 'focused' : ''} ${formData.password ? 'has-value' : ''}`}>
                        <div className="input-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                        />
                        <label htmlFor="password" className="floating-label">Password</label>
                        <button 
                            type="button" 
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            )}
                        </button>
                        <div className="input-line"></div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                            <span className="label-text">Remember me</span>
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`submit-btn ${loading ? 'loading' : ''}`}
                    >
                        <span className="btn-text">
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </span>
                        <span className="btn-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </span>
                        {loading && <div className="btn-loader"></div>}
                    </button>
                </form>

                {/* Security Note */}
                <div className="security-note">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span>Secure, encrypted connection</span>
                </div>

                {/* Demo Credentials */}
                <div className="demo-credentials">
                    <p>Default Credentials</p>
                    <div className="credentials-box">
                        <div>
                            <span className="label">Username:</span>
                            <span className="value">admin</span>
                        </div>
                        <div>
                            <span className="label">Password:</span>
                            <span className="value">Admin@123</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="login-footer">
                <p>© 2025 SmartPark. Group 6(Romain).</p>
                <div className="tech-stack">
                    <span>React</span>
                    <span>•</span>
                    <span>Node.js</span>
                    <span>•</span>
                    <span>MySQL</span>
                </div>
            </div>

            {/* CSS Styles */}
            <style>{`
                /* ===== CSS VARIABLES ===== */
                :root {
                    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    --glass-bg: rgba(255, 255, 255, 0.95);
                    --glass-border: rgba(255, 255, 255, 0.2);
                    --shadow-soft: 0 8px 32px rgba(31, 38, 135, 0.15);
                    --shadow-glow: 0 0 40px rgba(102, 126, 234, 0.3);
                    --text-primary: #1a202c;
                    --text-secondary: #4a5568;
                    --text-muted: #718096;
                    --error-color: #e53e3e;
                    --success-color: #38a169;
                }

                /* ===== CONTAINER ===== */
                .login-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #f7fafc;
                }

                /* ===== ANIMATED BACKGROUND ===== */
                .animated-bg {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    z-index: 0;
                }

                .gradient-sphere {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.6;
                    animation: float 20s infinite ease-in-out;
                }

                .sphere-1 {
                    width: 600px;
                    height: 600px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    top: -200px;
                    left: -200px;
                    animation-delay: 0s;
                }

                .sphere-2 {
                    width: 500px;
                    height: 500px;
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    bottom: -150px;
                    right: -150px;
                    animation-delay: -5s;
                }

                .sphere-3 {
                    width: 400px;
                    height: 400px;
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation-delay: -10s;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -30px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }

                /* Particles */
                .particles {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }

                .particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: rgba(102, 126, 234, 0.3);
                    border-radius: 50%;
                    animation: particle-float 15s infinite;
                }

                ${[...Array(20)].map((_, i) => `
                    .particle-${i + 1} {
                        left: ${Math.random() * 100}%;
                        top: ${Math.random() * 100}%;
                        animation-delay: -${Math.random() * 15}s;
                        animation-duration: ${15 + Math.random() * 10}s;
                    }
                `).join('')}

                @keyframes particle-float {
                    0%, 100% { 
                        transform: translateY(0) translateX(0); 
                        opacity: 0;
                    }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { 
                        transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}100px); 
                        opacity: 0;
                    }
                }

                /* ===== LOGIN CARD ===== */
                .login-card {
                    position: relative;
                    z-index: 1;
                    background: var(--glass-bg);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid var(--glass-border);
                    border-radius: 24px;
                    padding: 48px;
                    width: 100%;
                    max-width: 440px;
                    box-shadow: var(--shadow-soft), var(--shadow-glow);
                    animation: card-enter 0.6s ease-out;
                }

                @keyframes card-enter {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                /* ===== LOGO SECTION ===== */
                .logo-section {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .logo-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 20px;
                    background: var(--primary-gradient);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
                    animation: pulse-glow 2s infinite;
                }

                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4); }
                    50% { box-shadow: 0 10px 40px rgba(102, 126, 234, 0.6); }
                }

                .logo-icon svg {
                    width: 40px;
                    height: 40px;
                }

                .brand-name {
                    font-size: 32px;
                    font-weight: 800;
                    background: var(--primary-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 0 0 8px 0;
                    letter-spacing: -0.5px;
                }

                .brand-tagline {
                    color: var(--text-secondary);
                    font-size: 14px;
                    margin: 0 0 12px 0;
                    font-weight: 500;
                }

                .location-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(102, 126, 234, 0.1);
                    color: #667eea;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }

                /* ===== ERROR MESSAGE ===== */
                .error-message {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(229, 62, 62, 0.1);
                    color: var(--error-color);
                    padding: 14px 16px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                    font-size: 14px;
                    font-weight: 500;
                    border: 1px solid rgba(229, 62, 62, 0.2);
                    animation: shake 0.5s ease-in-out;
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                /* ===== FORM ===== */
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .input-group {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-icon {
                    position: absolute;
                    left: 16px;
                    color: var(--text-muted);
                    transition: all 0.3s ease;
                    z-index: 2;
                }

                .input-group.focused .input-icon {
                    color: #667eea;
                    transform: scale(1.1);
                }

                .input-group input {
                    width: 100%;
                    padding: 16px 16px 16px 48px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 500;
                    color: var(--text-primary);
                    background: white;
                    transition: all 0.3s ease;
                    outline: none;
                }

                .input-group input[type="password"],
                .input-group input[type="text"] {
                    padding-right: 48px;
                }

                .input-group.focused input {
                    border-color: #667eea;
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
                }

                .floating-label {
                    position: absolute;
                    left: 48px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    font-size: 15px;
                    font-weight: 500;
                    pointer-events: none;
                    transition: all 0.3s ease;
                    background: white;
                    padding: 0 4px;
                }

                .input-group.focused .floating-label,
                .input-group.has-value .floating-label {
                    top: 0;
                    font-size: 12px;
                    color: #667eea;
                    font-weight: 600;
                }

                .input-line {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0;
                    height: 2px;
                    background: var(--primary-gradient);
                    transition: all 0.3s ease;
                    transform: translateX(-50%);
                }

                .input-group.focused .input-line {
                    width: calc(100% - 4px);
                }

                .toggle-password {
                    position: absolute;
                    right: 16px;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .toggle-password:hover {
                    color: #667eea;
                    transform: scale(1.1);
                }

                /* ===== FORM OPTIONS ===== */
                .form-options {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 4px;
                }

                .remember-me {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    color: var(--text-secondary);
                    font-weight: 500;
                }

                .remember-me input {
                    display: none;
                }

                .checkmark {
                    width: 18px;
                    height: 18px;
                    border: 2px solid #cbd5e0;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .remember-me input:checked + .checkmark {
                    background: var(--primary-gradient);
                    border-color: transparent;
                }

                .checkmark::after {
                    content: '✓';
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                    opacity: 0;
                    transform: scale(0);
                    transition: all 0.3s ease;
                }

                .remember-me input:checked + .checkmark::after {
                    opacity: 1;
                    transform: scale(1);
                }

                .forgot-password {
                    color: #667eea;
                    font-size: 14px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .forgot-password:hover {
                    color: #764ba2;
                    text-decoration: underline;
                }

                /* ===== SUBMIT BUTTON ===== */
                .submit-btn {
                    position: relative;
                    width: 100%;
                    padding: 16px 24px;
                    margin-top: 8px;
                    background: var(--primary-gradient);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
                }

                .submit-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .submit-btn:disabled {
                    opacity: 0.8;
                    cursor: not-allowed;
                }

                .submit-btn.loading {
                    color: transparent;
                }

                .btn-icon {
                    transition: transform 0.3s ease;
                }

                .submit-btn:hover:not(:disabled) .btn-icon {
                    transform: translateX(4px);
                }

                .btn-loader {
                    position: absolute;
                    width: 24px;
                    height: 24px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* ===== SECURITY NOTE ===== */
                .security-note {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 24px;
                    padding-top: 24px;
                    border-top: 1px solid #e2e8f0;
                    color: var(--text-muted);
                    font-size: 13px;
                    font-weight: 500;
                }

                .security-note svg {
                    color: #38a169;
                }

                /* ===== DEMO CREDENTIALS ===== */
                .demo-credentials {
                    margin-top: 24px;
                    text-align: center;
                }

                .demo-credentials > p {
                    font-size: 12px;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 12px;
                }

                .credentials-box {
                    background: rgba(102, 126, 234, 0.05);
                    border: 1px dashed #cbd5e0;
                    border-radius: 10px;
                    padding: 14px;
                    display: flex;
                    justify-content: space-around;
                }

                .credentials-box > div {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .credentials-box .label {
                    font-size: 11px;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .credentials-box .value {
                    font-size: 14px;
                    color: var(--text-primary);
                    font-weight: 700;
                    font-family: 'Courier New', monospace;
                    background: white;
                    padding: 4px 10px;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                }

                /* ===== FOOTER ===== */
                .login-footer {
                    position: relative;
                    z-index: 1;
                    margin-top: 32px;
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 13px;
                }

                .login-footer p {
                    margin: 0 0 8px 0;
                    font-weight: 500;
                }

                .tech-stack {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    font-weight: 600;
                }

                .tech-stack span {
                    color: #667eea;
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 480px) {
                    .login-card {
                        margin: 20px;
                        padding: 32px 24px;
                        border-radius: 20px;
                    }

                    .brand-name {
                        font-size: 28px;
                    }

                    .sphere-1, .sphere-2, .sphere-3 {
                        display: none;
                    }
                }

                /* ===== PRINT STYLES ===== */
                @media print {
                    .animated-bg, .login-footer {
                        display: none;
                    }
                    
                    .login-card {
                        box-shadow: none;
                        border: 1px solid #ddd;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;
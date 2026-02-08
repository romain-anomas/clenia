import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { path: '/cars', label: 'Cars', icon: '🚗' },
        { path: '/parking-slots', label: 'Slots', icon: '🅿️' },
        { path: '/parking-records', label: 'Records', icon: '📋' },
        { path: '/payments', label: 'Payments', icon: '💳' },
        { path: '/reports', label: 'Reports', icon: '📊' },
    ];

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    {/* Logo */}
                    <Link to="/" className="nav-logo">
                        <div className="logo-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <div className="logo-text">
                            <span className="logo-title">SmartPark</span>
                            <span className="logo-subtitle">PSSMS</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="nav-links">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                                {location.pathname === item.path && <div className="nav-indicator" />}
                            </Link>
                        ))}
                    </div>

                    {/* User Section */}
                    <div className="nav-user">
                        <div className="user-info">
                            <div className="user-avatar">
                                {user.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="user-details">
                                <span className="user-name">{user.username || 'User'}</span>
                                <span className="user-role">Administrator</span>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="logout-btn" title="Logout">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <div className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="mobile-nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="mobile-logout">
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            <style>{`
                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 100;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(229, 231, 235, 0.5);
                    transition: all 0.3s ease;
                }

                .navbar.scrolled {
                    background: rgba(255, 255, 255, 0.95);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }

                .nav-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                    height: 72px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                }

                .nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    text-decoration: none;
                    color: var(--gray-900);
                }

                .logo-icon {
                    width: 40px;
                    height: 40px;
                    background: var(--primary-gradient);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
                }

                .logo-icon svg {
                    width: 24px;
                    height: 24px;
                }

                .logo-text {
                    display: flex;
                    flex-direction: column;
                }

                .logo-title {
                    font-size: 1.25rem;
                    font-weight: 800;
                    background: var(--primary-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    line-height: 1.2;
                }

                .logo-subtitle {
                    font-size: 0.625rem;
                    font-weight: 700;
                    color: var(--gray-400);
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }

                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex: 1;
                    justify-content: center;
                }

                .nav-link {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.625rem 1.25rem;
                    border-radius: 10px;
                    color: var(--gray-600);
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.875rem;
                    transition: all 0.3s ease;
                }

                .nav-link:hover {
                    color: var(--primary-600);
                    background: rgba(99, 102, 241, 0.08);
                }

                .nav-link.active {
                    color: var(--primary-600);
                    background: rgba(99, 102, 241, 0.12);
                }

                .nav-icon {
                    font-size: 1.125rem;
                }

                .nav-indicator {
                    position: absolute;
                    bottom: -2px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 20px;
                    height: 3px;
                    background: var(--primary-gradient);
                    border-radius: 3px;
                }

                .nav-user {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem;
                    border-radius: 12px;
                    transition: background 0.3s ease;
                }

                .user-info:hover {
                    background: var(--gray-100);
                }

                .user-avatar {
                    width: 36px;
                    height: 36px;
                    background: var(--primary-gradient);
                    color: white;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 0.875rem;
                }

                .user-details {
                    display: flex;
                    flex-direction: column;
                    line-height: 1.2;
                }

                .user-name {
                    font-weight: 700;
                    color: var(--gray-900);
                    font-size: 0.875rem;
                }

                .user-role {
                    font-size: 0.75rem;
                    color: var(--gray-500);
                    font-weight: 500;
                }

                .logout-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    border: none;
                    background: var(--gray-100);
                    color: var(--gray-600);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .logout-btn:hover {
                    background: var(--error-500);
                    color: white;
                    transform: rotate(90deg);
                }

                .mobile-menu-btn {
                    display: none;
                    background: none;
                    border: none;
                    padding: 0.5rem;
                    cursor: pointer;
                }

                .hamburger {
                    width: 24px;
                    height: 18px;
                    position: relative;
                }

                .hamburger span {
                    position: absolute;
                    width: 100%;
                    height: 2px;
                    background: var(--gray-700);
                    border-radius: 2px;
                    transition: all 0.3s ease;
                }

                .hamburger span:nth-child(1) { top: 0; }
                .hamburger span:nth-child(2) { top: 8px; }
                .hamburger span:nth-child(3) { top: 16px; }

                .hamburger.open span:nth-child(1) {
                    top: 8px;
                    transform: rotate(45deg);
                }

                .hamburger.open span:nth-child(2) {
                    opacity: 0;
                }

                .hamburger.open span:nth-child(3) {
                    top: 8px;
                    transform: rotate(-45deg);
                }

                .mobile-menu {
                    display: none;
                    position: absolute;
                    top: 72px;
                    left: 0;
                    right: 0;
                    background: white;
                    border-bottom: 1px solid var(--gray-200);
                    padding: 1rem;
                    flex-direction: column;
                    gap: 0.5rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }

                .mobile-menu.open {
                    display: flex;
                    animation: slideInRight 0.3s ease;
                }

                .mobile-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    border-radius: 12px;
                    color: var(--gray-700);
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .mobile-nav-link.active {
                    background: rgba(99, 102, 241, 0.1);
                    color: var(--primary-600);
                }

                .mobile-nav-icon {
                    font-size: 1.25rem;
                }

                .mobile-logout {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    border-radius: 12px;
                    border: none;
                    background: var(--error-bg);
                    color: var(--error-500);
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 0.5rem;
                }

                @media (max-width: 1024px) {
                    .nav-links, .user-details {
                        display: none;
                    }

                    .mobile-menu-btn {
                        display: block;
                    }

                    .nav-container {
                        padding: 0 1rem;
                    }
                }

                @media (max-width: 640px) {
                    .logo-subtitle {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
};

export default Navbar;
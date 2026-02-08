import { useState, useEffect } from 'react';
import { getAllCars, createCar, updateCar, deleteCar } from '../api/carApi';

const Car = () => {
    const [cars, setCars] = useState([]);
    const [formData, setFormData] = useState({ PlateNumber: '', DriverName: '', PhoneNumber: '' });
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total: 0, recent: 0 });

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await getAllCars();
            setCars(response.data);
            setStats({
                total: response.data.length,
                recent: response.data.filter(c => {
                    const daysSince = (new Date() - new Date(c.created_at || Date.now())) / (1000 * 60 * 60 * 24);
                    return daysSince <= 7;
                }).length
            });
        } catch (error) {
            showMessage('Error fetching cars', 'error');
        }
    };

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(''), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (editing) {
                await updateCar(editing, formData);
                showMessage('Car updated successfully!');
            } else {
                await createCar(formData);
                showMessage('Car registered successfully!');
            }
            resetForm();
            fetchCars();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Operation failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ PlateNumber: '', DriverName: '', PhoneNumber: '' });
        setEditing(null);
    };

    const handleEdit = (car) => {
        setFormData({
            PlateNumber: car.PlateNumber,
            DriverName: car.DriverName,
            PhoneNumber: car.PhoneNumber
        });
        setEditing(car.PlateNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (plateNumber) => {
        if (!window.confirm('Are you sure you want to delete this car?')) return;
        
        try {
            await deleteCar(plateNumber);
            showMessage('Car deleted successfully!');
            fetchCars();
        } catch (error) {
            showMessage('Error deleting car', 'error');
        }
    };

    const filteredCars = cars.filter(car => 
        car.PlateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.DriverName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-content car-page">
            {/* Header Section */}
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">
                        <span className="title-icon">🚗</span>
                        Car Management
                    </h1>
                    <p className="page-subtitle">Manage registered vehicles and their information</p>
                </div>
                <div className="stats-grid">
                    <div className="stat-card animate-fadeIn delay-100">
                        <div className="stat-icon" style={{background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1'}}>
                            🚙
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total Cars</span>
                        </div>
                    </div>
                    <div className="stat-card animate-fadeIn delay-200">
                        <div className="stat-icon" style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981'}}>
                            ✨
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.recent}</span>
                            <span className="stat-label">New This Week</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message Toast */}
            {message && (
                <div className={`toast toast-${message.type}`}>
                    {message.type === 'success' ? '✅' : '❌'}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="content-grid">
                {/* Form Card */}
                <div className="form-card glass-card animate-slideInLeft">
                    <div className="card-header">
                        <div className="card-icon">{editing ? '✏️' : '➕'}</div>
                        <h2 className="card-title">{editing ? 'Edit Car' : 'Register New Car'}</h2>
                        <p className="card-subtitle">{editing ? 'Update vehicle information' : 'Add a new vehicle to the system'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="car-form">
                        <div className="form-group">
                            <label className="form-label">
                                <span>Plate Number</span>
                                <span className="required">*</span>
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    required
                                    disabled={editing}
                                    className="input-field"
                                    placeholder="e.g., RAA123A"
                                    value={formData.PlateNumber}
                                    onChange={(e) => setFormData({...formData, PlateNumber: e.target.value.toUpperCase()})}
                                />
                                <span className="input-hint">Rwanda format: RAA123A</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <span>Driver Name</span>
                                <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="Full name of driver"
                                value={formData.DriverName}
                                onChange={(e) => setFormData({...formData, DriverName: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <span>Phone Number</span>
                                <span className="required">*</span>
                            </label>
                            <input
                                type="tel"
                                required
                                className="input-field"
                                placeholder="+250 7XX XXX XXX"
                                value={formData.PhoneNumber}
                                onChange={(e) => setFormData({...formData, PhoneNumber: e.target.value})}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" disabled={loading} className="btn btn-primary btn-submit">
                                {loading ? (
                                    <>
                                        <div className="spinner"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{editing ? 'Update Car' : 'Register Car'}</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                            {editing && (
                                <button type="button" onClick={resetForm} className="btn btn-secondary">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Card */}
                <div className="list-card glass-card animate-slideInRight">
                    <div className="card-header">
                        <div className="list-header-content">
                            <div>
                                <h2 className="card-title">Registered Cars</h2>
                                <p className="card-subtitle">{filteredCars.length} vehicles in system</p>
                            </div>
                            <div className="search-box">
                                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="M21 21l-4.35-4.35"></path>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search cars..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="data-table cars-table">
                            <thead>
                                <tr>
                                    <th>Plate Number</th>
                                    <th>Driver</th>
                                    <th>Contact</th>
                                    <th className="actions-header">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCars.map((car, index) => (
                                    <tr key={car.PlateNumber} className="animate-fadeIn" style={{animationDelay: `${index * 50}ms`}}>
                                        <td>
                                            <div className="plate-badge">
                                                <span className="plate-flag">🇷🇼</span>
                                                <span className="plate-text">{car.PlateNumber}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="driver-info">
                                                <div className="driver-avatar">{car.DriverName.charAt(0)}</div>
                                                <span className="driver-name">{car.DriverName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <a href={`tel:${car.PhoneNumber}`} className="phone-link">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                </svg>
                                                {car.PhoneNumber}
                                            </a>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    onClick={() => handleEdit(car)} 
                                                    className="action-btn edit-btn"
                                                    title="Edit"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(car.PlateNumber)} 
                                                    className="action-btn delete-btn"
                                                    title="Delete"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredCars.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">🚗</div>
                                <h3>No cars found</h3>
                                <p>{searchTerm ? 'Try adjusting your search' : 'Register your first car to get started'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .car-page {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .page-header {
                    margin-bottom: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                }

                .page-title {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: var(--gray-900);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin: 0 0 0.5rem 0;
                }

                .title-icon {
                    font-size: 2.5rem;
                }

                .page-subtitle {
                    color: var(--gray-500);
                    font-size: 1rem;
                    margin: 0;
                }

                .stats-grid {
                    display: flex;
                    gap: 1rem;
                }

                .stat-card {
                    min-width: 160px;
                }

                .stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    margin-bottom: 0.75rem;
                }

                .stat-info {
                    display: flex;
                    flex-direction: column;
                }

                .stat-value {
                    font-size: 1.875rem;
                    font-weight: 800;
                    color: var(--gray-900);
                    line-height: 1;
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: var(--gray-500);
                    font-weight: 600;
                    margin-top: 0.25rem;
                }

                .content-grid {
                    display: grid;
                    grid-template-columns: 380px 1fr;
                    gap: 2rem;
                }

                .form-card {
                    padding: 1.5rem;
                    height: fit-content;
                    position: sticky;
                    top: 88px;
                }

                .card-header {
                    margin-bottom: 1.5rem;
                }

                .card-icon {
                    width: 48px;
                    height: 48px;
                    background: var(--primary-gradient);
                    color: white;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                }

                .card-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--gray-900);
                    margin: 0 0 0.25rem 0;
                }

                .card-subtitle {
                    font-size: 0.875rem;
                    color: var(--gray-500);
                    margin: 0;
                }

                .car-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-label {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--gray-700);
                }

                .required {
                    color: var(--error-500);
                }

                .input-wrapper {
                    position: relative;
                }

                .input-hint {
                    font-size: 0.75rem;
                    color: var(--gray-400);
                    margin-top: 0.25rem;
                    display: block;
                }

                .form-actions {
                    display: flex;
                    gap: 0.75rem;
                    margin-top: 0.5rem;
                }

                .btn-submit {
                    flex: 1;
                }

                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                .list-card {
                    padding: 1.5rem;
                    overflow: hidden;
                }

                .list-header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .search-box {
                    position: relative;
                    width: 280px;
                }

                .search-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--gray-400);
                }

                .search-input {
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem 2.75rem;
                    border: 2px solid var(--gray-200);
                    border-radius: var(--radius-md);
                    font-size: 0.875rem;
                    transition: all 0.3s ease;
                    background: white;
                }

                .search-input:focus {
                    outline: none;
                    border-color: var(--primary-500);
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                .table-container {
                    margin-top: 1.5rem;
                    overflow-x: auto;
                }

                .cars-table th {
                    background: var(--gray-50);
                    font-weight: 700;
                }

                .plate-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--gray-900);
                    color: white;
                    padding: 0.5rem 0.75rem;
                    border-radius: 6px;
                    font-weight: 700;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 0.5px;
                }

                .plate-flag {
                    font-size: 1rem;
                }

                .driver-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .driver-avatar {
                    width: 32px;
                    height: 32px;
                    background: var(--primary-gradient);
                    color: white;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 0.875rem;
                }

                .driver-name {
                    font-weight: 600;
                    color: var(--gray-800);
                }

                .phone-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary-600);
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.875rem;
                    transition: all 0.3s ease;
                }

                .phone-link:hover {
                    color: var(--primary-700);
                }

                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                }

                .action-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .edit-btn {
                    background: rgba(99, 102, 241, 0.1);
                    color: var(--primary-600);
                }

                .edit-btn:hover {
                    background: var(--primary-600);
                    color: white;
                    transform: translateY(-2px);
                }

                .delete-btn {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--error-500);
                }

                .delete-btn:hover {
                    background: var(--error-500);
                    color: white;
                    transform: translateY(-2px);
                }

                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                }

                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                .empty-state h3 {
                    color: var(--gray-700);
                    margin: 0 0 0.5rem 0;
                }

                .empty-state p {
                    color: var(--gray-500);
                    margin: 0;
                }

                @media (max-width: 1024px) {
                    .content-grid {
                        grid-template-columns: 1fr;
                    }

                    .form-card {
                        position: static;
                    }

                    .page-header {
                        flex-direction: column;
                    }

                    .stats-grid {
                        width: 100%;
                    }

                    .search-box {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default Car;
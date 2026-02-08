import { useState, useEffect } from 'react';
import { getAllSlots, createSlot, updateSlot, deleteSlot } from '../api/parkingSlotApi';

const ParkingSlot = () => {
    const [slots, setSlots] = useState([]);
    const [formData, setFormData] = useState({ SlotNumber: '', SlotStatus: 'Available' });
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const response = await getAllSlots();
            setSlots(response.data);
        } catch (error) {
            showMessage('Error fetching slots', 'error');
        }
    };

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(''), 3000);
    };

    const getStatusConfig = (status) => {
        const configs = {
            'Available': { 
                color: '#10b981', 
                bg: 'rgba(16, 185, 129, 0.1)', 
                icon: '✅',
                label: 'Available'
            },
            'Occupied': { 
                color: '#ef4444', 
                bg: 'rgba(239, 68, 68, 0.1)', 
                icon: '🚗',
                label: 'Occupied'
            },
            'Maintenance': { 
                color: '#f59e0b', 
                bg: 'rgba(245, 158, 11, 0.1)', 
                icon: '🔧',
                label: 'Maintenance'
            }
        };
        return configs[status] || configs['Available'];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (editing) {
                await updateSlot(editing, formData);
                showMessage('Slot updated successfully!');
            } else {
                await createSlot(formData);
                showMessage('Slot created successfully!');
            }
            resetForm();
            fetchSlots();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Operation failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ SlotNumber: '', SlotStatus: 'Available' });
        setEditing(null);
    };

    const handleEdit = (slot) => {
        setFormData({ SlotNumber: slot.SlotNumber, SlotStatus: slot.SlotStatus });
        setEditing(slot.SlotNumber);
    };

    const handleDelete = async (slotNumber) => {
        if (!window.confirm('Delete this parking slot?')) return;
        try {
            await deleteSlot(slotNumber);
            showMessage('Slot deleted successfully!');
            fetchSlots();
        } catch (error) {
            showMessage('Error deleting slot', 'error');
        }
    };

    const filteredSlots = filter === 'all' ? slots : slots.filter(s => s.SlotStatus.toLowerCase() === filter);

    const stats = {
        total: slots.length,
        available: slots.filter(s => s.SlotStatus === 'Available').length,
        occupied: slots.filter(s => s.SlotStatus === 'Occupied').length,
        maintenance: slots.filter(s => s.SlotStatus === 'Maintenance').length
    };

    const occupancyRate = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0;

    return (
        <div className="page-content slot-page">
            {/* Message */}
            {message && (
                <div className={`toast toast-${message.type}`}>
                    {message.type === 'success' ? '✅' : '❌'}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="title-icon">🅿️</span>
                        Parking Slots
                    </h1>
                    <p className="page-subtitle">Manage parking space availability and status</p>
                </div>
                <div className="occupancy-card">
                    <div className="occupancy-info">
                        <span className="occupancy-label">Occupancy Rate</span>
                        <span className="occupancy-value">{occupancyRate}%</span>
                    </div>
                    <div className="occupancy-bar">
                        <div className="occupancy-fill" style={{width: `${occupancyRate}%`}}></div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-row">
                <div className="stat-pill" style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981'}}>
                    <span className="stat-dot" style={{background: '#10b981'}}></span>
                    <span>{stats.available} Available</span>
                </div>
                <div className="stat-pill" style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444'}}>
                    <span className="stat-dot" style={{background: '#ef4444'}}></span>
                    <span>{stats.occupied} Occupied</span>
                </div>
                <div className="stat-pill" style={{background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b'}}>
                    <span className="stat-dot" style={{background: '#f59e0b'}}></span>
                    <span>{stats.maintenance} Maintenance</span>
                </div>
                <div className="stat-pill total">
                    <span>{stats.total} Total</span>
                </div>
            </div>

            <div className="content-grid">
                {/* Form */}
                <div className="form-card glass-card animate-slideInLeft">
                    <div className="card-header">
                        <div className="card-icon" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                            {editing ? '✏️' : '➕'}
                        </div>
                        <h2 className="card-title">{editing ? 'Edit Slot' : 'New Slot'}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="slot-form">
                        <div className="form-group">
                            <label className="form-label">Slot Number <span className="required">*</span></label>
                            <input
                                type="text"
                                required
                                disabled={editing}
                                className="input-field"
                                placeholder="e.g., A1, B2"
                                value={formData.SlotNumber}
                                onChange={(e) => setFormData({...formData, SlotNumber: e.target.value.toUpperCase()})}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <div className="status-options">
                                {['Available', 'Occupied', 'Maintenance'].map(status => {
                                    const config = getStatusConfig(status);
                                    return (
                                        <button
                                            key={status}
                                            type="button"
                                            className={`status-option ${formData.SlotStatus === status ? 'active' : ''}`}
                                            style={{
                                                '--status-color': config.color,
                                                '--status-bg': config.bg
                                            }}
                                            onClick={() => setFormData({...formData, SlotStatus: status})}
                                        >
                                            <span>{config.icon}</span>
                                            <span>{status}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" disabled={loading} className="btn btn-primary btn-submit">
                                {loading ? <div className="spinner"></div> : (
                                    <>{editing ? 'Update' : 'Create'} Slot</>
                                )}
                            </button>
                            {editing && (
                                <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Grid */}
                <div className="grid-card glass-card animate-slideInRight">
                    <div className="grid-header">
                        <h2 className="card-title">Parking Layout</h2>
                        <div className="filter-tabs">
                            {['all', 'available', 'occupied', 'maintenance'].map(f => (
                                <button
                                    key={f}
                                    className={`filter-tab ${filter === f ? 'active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="slots-grid">
                        {filteredSlots.map((slot, index) => {
                            const config = getStatusConfig(slot.SlotStatus);
                            return (
                                <div
                                    key={slot.SlotNumber}
                                    className={`slot-item ${slot.SlotStatus.toLowerCase()}`}
                                    style={{
                                        animationDelay: `${index * 30}ms`,
                                        '--slot-color': config.color,
                                        '--slot-bg': config.bg
                                    }}
                                >
                                    <div className="slot-header">
                                        <span className="slot-number">{slot.SlotNumber}</span>
                                        <div className="slot-actions">
                                            <button onClick={() => handleEdit(slot)} className="slot-btn edit">✏️</button>
                                            <button onClick={() => handleDelete(slot.SlotNumber)} className="slot-btn delete">🗑️</button>
                                        </div>
                                    </div>
                                    <div className="slot-status">
                                        <span className="status-icon">{config.icon}</span>
                                        <span className="status-text">{config.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredSlots.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🅿️</div>
                            <h3>No slots found</h3>
                            <p>Create your first parking slot to get started</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .slot-page {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .occupancy-card {
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    min-width: 200px;
                }

                .occupancy-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }

                .occupancy-label {
                    font-size: 0.875rem;
                    color: var(--gray-500);
                    font-weight: 600;
                }

                .occupancy-value {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--gray-900);
                }

                .occupancy-bar {
                    height: 6px;
                    background: var(--gray-200);
                    border-radius: 3px;
                    overflow: hidden;
                }

                .occupancy-fill {
                    height: 100%;
                    background: var(--primary-gradient);
                    border-radius: 3px;
                    transition: width 0.5s ease;
                }

                .stats-row {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                .stat-pill {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.625rem 1rem;
                    border-radius: 50px;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .stat-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }

                .stat-pill.total {
                    background: var(--gray-900);
                    color: white;
                    margin-left: auto;
                }

                .content-grid {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 2rem;
                }

                .status-options {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .status-option {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.875rem 1rem;
                    border: 2px solid var(--gray-200);
                    border-radius: 10px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    color: var(--gray-700);
                }

                .status-option:hover {
                    border-color: var(--status-color);
                    background: var(--status-bg);
                }

                .status-option.active {
                    border-color: var(--status-color);
                    background: var(--status-bg);
                    color: var(--status-color);
                }

                .grid-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .filter-tabs {
                    display: flex;
                    gap: 0.5rem;
                    background: var(--gray-100);
                    padding: 0.25rem;
                    border-radius: 10px;
                }

                .filter-tab {
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--gray-500);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .filter-tab.active {
                    background: white;
                    color: var(--gray-900);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .slots-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 1rem;
                }

                .slot-item {
                    background: white;
                    border: 2px solid var(--gray-200);
                    border-radius: 16px;
                    padding: 1rem;
                    transition: all 0.3s ease;
                    animation: scaleIn 0.3s ease-out backwards;
                }

                .slot-item:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }

                .slot-item.available {
                    border-color: #10b981;
                    background: rgba(16, 185, 129, 0.05);
                }

                .slot-item.occupied {
                    border-color: #ef4444;
                    background: rgba(239, 68, 68, 0.05);
                }

                .slot-item.maintenance {
                    border-color: #f59e0b;
                    background: rgba(245, 158, 11, 0.05);
                }

                .slot-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }

                .slot-number {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--gray-900);
                }

                .slot-actions {
                    display: flex;
                    gap: 0.25rem;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .slot-item:hover .slot-actions {
                    opacity: 1;
                }

                .slot-btn {
                    width: 28px;
                    height: 28px;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .slot-btn.edit:hover { background: rgba(99, 102, 241, 0.2); }
                .slot-btn.delete:hover { background: rgba(239, 68, 68, 0.2); }

                .slot-status {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--slot-color);
                }

                .status-icon {
                    font-size: 1rem;
                }

                @media (max-width: 1024px) {
                    .content-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 640px) {
                    .slots-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .stats-row {
                        justify-content: center;
                    }
                    
                    .stat-pill.total {
                        margin-left: 0;
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default ParkingSlot;
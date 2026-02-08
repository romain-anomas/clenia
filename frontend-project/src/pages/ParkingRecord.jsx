import { useState, useEffect } from 'react';
import { getAllRecords, getActiveRecords, createEntry, updateExit, deleteRecord } from '../api/parkingRecordApi';
import { getAvailableSlots } from '../api/parkingSlotApi';
import { getAllCars } from '../api/carApi';
import { createPayment } from '../api/paymentApi';

const ParkingRecord = () => {
    const [records, setRecords] = useState([]);
    const [activeRecords, setActiveRecords] = useState([]);
    const [cars, setCars] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [entryForm, setEntryForm] = useState({ PlateNumber: '', SlotNumber: '', EntryTime: '' });
    const [exitForm, setExitForm] = useState({ RecordID: '', ExitTime: '' });
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('active');

    useEffect(() => {
        fetchData();
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setEntryForm(prev => ({...prev, EntryTime: now.toISOString().slice(0, 16)}));
    }, []);

    const fetchData = async () => {
        try {
            const [recordsRes, activeRes, carsRes, slotsRes] = await Promise.all([
                getAllRecords(),
                getActiveRecords(),
                getAllCars(),
                getAvailableSlots()
            ]);
            setRecords(recordsRes.data);
            setActiveRecords(activeRes.data);
            setCars(carsRes.data);
            setAvailableSlots(slotsRes.data);
        } catch (error) {
            showMessage('Error fetching data', 'error');
        }
    };

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(''), 3000);
    };

    const handleEntry = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createEntry(entryForm);
            showMessage('Entry recorded successfully!');
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            setEntryForm({ PlateNumber: '', SlotNumber: '', EntryTime: now.toISOString().slice(0, 16) });
            fetchData();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Failed to record entry', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleExit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await updateExit(exitForm.RecordID, { ExitTime: exitForm.ExitTime });
            showMessage(`Exit recorded. Amount: ${response.data.amount} RWF`);
            setBill({...response.data, RecordID: exitForm.RecordID});
            fetchData();
        } catch (error) {
            showMessage('Failed to record exit', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!bill) return;
        try {
            await createPayment({
                RecordID: bill.RecordID,
                AmountPaid: bill.amount,
                PaymentDate: new Date().toISOString()
            });
            showMessage('Payment recorded successfully!');
            setBill(null);
            setExitForm({ RecordID: '', ExitTime: '' });
            fetchData();
        } catch (error) {
            showMessage('Error recording payment', 'error');
        }
    };

    const handleDelete = async (recordId) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await deleteRecord(recordId);
            showMessage('Record deleted');
            fetchData();
        } catch (error) {
            showMessage('Error deleting record', 'error');
        }
    };

    const initiateExit = (record) => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setExitForm({RecordID: record.RecordID, ExitTime: now.toISOString().slice(0, 16)});
        setBill(null);
    };

    const calculateDuration = (entry, exit) => {
        const diff = new Date(exit) - new Date(entry);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="page-content record-page">
            {message && (
                <div className={`toast toast-${message.type}`}>
                    {message.type === 'success' ? '✅' : '❌'}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="title-icon">📋</span>
                        Parking Records
                    </h1>
                    <p className="page-subtitle">Manage vehicle entries, exits, and billing</p>
                </div>
                <div className="live-indicator">
                    <span className="live-dot"></span>
                    <span>{activeRecords.length} Active Sessions</span>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Entry Card */}
                <div className="action-card entry-card glass-card animate-fadeIn">
                    <div className="card-badge success">🟢 Entry</div>
                    <h3>Check In Vehicle</h3>
                    <form onSubmit={handleEntry} className="record-form">
                        <div className="form-group">
                            <label>Select Vehicle</label>
                            <select
                                required
                                className="input-field"
                                value={entryForm.PlateNumber}
                                onChange={(e) => setEntryForm({...entryForm, PlateNumber: e.target.value})}
                            >
                                <option value="">Choose car...</option>
                                {cars.map(car => (
                                    <option key={car.PlateNumber} value={car.PlateNumber}>
                                        {car.PlateNumber} - {car.DriverName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Select Slot</label>
                            <select
                                required
                                className="input-field"
                                value={entryForm.SlotNumber}
                                onChange={(e) => setEntryForm({...entryForm, SlotNumber: e.target.value})}
                            >
                                <option value="">Choose slot...</option>
                                {availableSlots.map(slot => (
                                    <option key={slot.SlotNumber} value={slot.SlotNumber}>
                                        {slot.SlotNumber} ({slot.SlotStatus})
                                    </option>
                                ))}
                            </select>
                            {availableSlots.length === 0 && (
                                <span className="field-hint error">⚠️ No available slots</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Entry Time</label>
                            <input
                                type="datetime-local"
                                required
                                className="input-field"
                                value={entryForm.EntryTime}
                                onChange={(e) => setEntryForm({...entryForm, EntryTime: e.target.value})}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-success btn-block">
                            {loading ? <div className="spinner"></div> : (
                                <>🚗 Record Entry</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Exit Card */}
                <div className="action-card exit-card glass-card animate-fadeIn delay-100">
                    <div className="card-badge danger">🔴 Exit & Bill</div>
                    <h3>Check Out Vehicle</h3>
                    <form onSubmit={handleExit} className="record-form">
                        <div className="form-group">
                            <label>Active Session</label>
                            <select
                                className="input-field"
                                value={exitForm.RecordID}
                                onChange={(e) => {
                                    const record = activeRecords.find(r => r.RecordID == e.target.value);
                                    if (record) initiateExit(record);
                                }}
                            >
                                <option value="">Select active record...</option>
                                {activeRecords.map(record => (
                                    <option key={record.RecordID} value={record.RecordID}>
                                        {record.PlateNumber} • Slot {record.SlotNumber} • {record.DriverName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Exit Time</label>
                            <input
                                type="datetime-local"
                                required
                                className="input-field"
                                value={exitForm.ExitTime}
                                onChange={(e) => setExitForm({...exitForm, ExitTime: e.target.value})}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || !exitForm.RecordID}
                            className="btn btn-danger btn-block"
                        >
                            {loading ? <div className="spinner"></div> : (
                                <>💰 Calculate Bill</>
                            )}
                        </button>

                        {bill && (
                            <div className="bill-preview animate-scaleIn">
                                <div className="bill-header">
                                    <span>🧾 Bill Summary</span>
                                </div>
                                <div className="bill-row">
                                    <span>Duration</span>
                                    <strong>{bill.duration} min ({bill.hours} hrs)</strong>
                                </div>
                                <div className="bill-row total">
                                    <span>Total</span>
                                    <strong className="bill-amount">{bill.amount} RWF</strong>
                                </div>
                                <button type="button" onClick={handlePayment} className="btn btn-primary btn-block btn-pay">
                                    💳 Confirm Payment
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Records List */}
                <div className="records-card glass-card animate-fadeIn delay-200">
                    <div className="records-header">
                        <div className="tab-switcher">
                            <button 
                                className={activeTab === 'active' ? 'active' : ''}
                                onClick={() => setActiveTab('active')}
                            >
                                🟢 Active ({activeRecords.length})
                            </button>
                            <button 
                                className={activeTab === 'all' ? 'active' : ''}
                                onClick={() => setActiveTab('all')}
                            >
                                📚 All Records ({records.length})
                            </button>
                        </div>
                    </div>

                    <div className="records-list">
                        {(activeTab === 'active' ? activeRecords : records).map((record, idx) => (
                            <div 
                                key={record.RecordID} 
                                className={`record-item ${!record.ExitTime ? 'active' : ''}`}
                                style={{animationDelay: `${idx * 50}ms`}}
                            >
                                <div className="record-main">
                                    <div className="record-plate">{record.PlateNumber}</div>
                                    <div className="record-details">
                                        <span className="record-slot">🅿️ {record.SlotNumber}</span>
                                        <span className="record-driver">👤 {record.DriverName}</span>
                                    </div>
                                    <div className="record-time">
                                        <div>🕐 {new Date(record.EntryTime).toLocaleString()}</div>
                                        {record.ExitTime && (
                                            <div>🏁 {new Date(record.ExitTime).toLocaleString()}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="record-actions">
                                    {!record.ExitTime ? (
                                        <button 
                                            onClick={() => initiateExit(record)}
                                            className="action-btn checkout"
                                        >
                                            Checkout
                                        </button>
                                    ) : (
                                        <>
                                            <span className="duration-badge">
                                                {calculateDuration(record.EntryTime, record.ExitTime)}
                                            </span>
                                            <button 
                                                onClick={() => handleDelete(record.RecordID)}
                                                className="action-btn delete"
                                            >
                                                🗑️
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {(activeTab === 'active' ? activeRecords : records).length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>No records found</h3>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .record-page {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .live-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    padding: 0.75rem 1.25rem;
                    border-radius: 50px;
                    font-weight: 600;
                }

                .live-dot {
                    width: 10px;
                    height: 10px;
                    background: #10b981;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 320px 320px 1fr;
                    gap: 1.5rem;
                }

                .action-card {
                    padding: 1.5rem;
                    position: relative;
                }

                .card-badge {
                    position: absolute;
                    top: -12px;
                    left: 1.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 50px;
                    font-size: 0.875rem;
                    font-weight: 700;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .card-badge.success {
                    background: #10b981;
                    color: white;
                }

                .card-badge.danger {
                    background: #ef4444;
                    color: white;
                }

                .action-card h3 {
                    margin: 1rem 0 1.5rem 0;
                    font-size: 1.125rem;
                    color: var(--gray-800);
                }

                .record-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .field-hint {
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                    display: block;
                }

                .field-hint.error {
                    color: var(--error-500);
                }

                .btn-block {
                    width: 100%;
                    margin-top: 0.5rem;
                }

                .btn-success {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
                }

                .btn-success:hover {
                    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
                }

                .btn-danger {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: white;
                    box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
                }

                .bill-preview {
                    margin-top: 1rem;
                    padding: 1rem;
                    background: var(--gray-50);
                    border-radius: 12px;
                    border: 2px dashed var(--primary-500);
                }

                .bill-header {
                    font-weight: 700;
                    color: var(--gray-700);
                    margin-bottom: 0.75rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid var(--gray-200);
                }

                .bill-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                }

                .bill-row.total {
                    margin-top: 0.75rem;
                    padding-top: 0.75rem;
                    border-top: 2px solid var(--gray-200);
                    font-size: 1rem;
                }

                .bill-amount {
                    color: var(--primary-600);
                    font-size: 1.25rem;
                }

                .btn-pay {
                    margin-top: 1rem;
                }

                .records-card {
                    padding: 1.5rem;
                    overflow: hidden;
                }

                .records-header {
                    margin-bottom: 1.5rem;
                }

                .tab-switcher {
                    display: flex;
                    gap: 0.5rem;
                    background: var(--gray-100);
                    padding: 0.25rem;
                    border-radius: 10px;
                }

                .tab-switcher button {
                    flex: 1;
                    padding: 0.625rem 1rem;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    font-weight: 600;
                    color: var(--gray-500);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .tab-switcher button.active {
                    background: white;
                    color: var(--gray-900);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .records-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    max-height: 600px;
                    overflow-y: auto;
                }

                .record-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: white;
                    border-radius: 12px;
                    border: 1px solid var(--gray-200);
                    transition: all 0.3s ease;
                    animation: fadeIn 0.3s ease-out;
                }

                .record-item:hover {
                    border-color: var(--primary-500);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .record-item.active {
                    background: rgba(16, 185, 129, 0.05);
                    border-color: #10b981;
                }

                .record-main {
                    flex: 1;
                }

                .record-plate {
                    font-size: 1.125rem;
                    font-weight: 800;
                    color: var(--gray-900);
                    font-family: 'Courier New', monospace;
                    background: var(--gray-900);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 6px;
                    display: inline-block;
                    margin-bottom: 0.5rem;
                }

                .record-details {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.875rem;
                    color: var(--gray-600);
                    margin-bottom: 0.5rem;
                }

                .record-time {
                    font-size: 0.75rem;
                    color: var(--gray-400);
                }

                .record-time div {
                    margin-bottom: 0.25rem;
                }

                .record-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .action-btn.checkout {
                    padding: 0.5rem 1rem;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .action-btn.checkout:hover {
                    background: #dc2626;
                    transform: scale(1.05);
                }

                .duration-badge {
                    background: var(--gray-100);
                    color: var(--gray-600);
                    padding: 0.375rem 0.75rem;
                    border-radius: 50px;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                @media (max-width: 1200px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                    
                    .records-card {
                        grid-column: 1 / -1;
                    }
                }

                @media (max-width: 768px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .record-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }
                    
                    .record-actions {
                        width: 100%;
                        justify-content: flex-end;
                    }
                }
            `}</style>
        </div>
    );
};

export default ParkingRecord;
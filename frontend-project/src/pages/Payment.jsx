import { useState, useEffect } from 'react';
import { getAllPayments, generateBill } from '../api/paymentApi';
import { getAllRecords } from '../api/parkingRecordApi';

const Payment = () => {
    const [payments, setPayments] = useState([]);
    const [records, setRecords] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ total: 0, today: 0, average: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [paymentsRes, recordsRes] = await Promise.all([
                getAllPayments(),
                getAllRecords()
            ]);
            setPayments(paymentsRes.data);
            setRecords(recordsRes.data.filter(r => r.ExitTime));
            
            // Calculate stats
            const total = paymentsRes.data.reduce((sum, p) => sum + parseFloat(p.AmountPaid), 0);
            const today = paymentsRes.data.filter(p => {
                const paymentDate = new Date(p.PaymentDate).toDateString();
                return paymentDate === new Date().toDateString();
            }).reduce((sum, p) => sum + parseFloat(p.AmountPaid), 0);
            
            setStats({
                total,
                today,
                average: paymentsRes.data.length ? total / paymentsRes.data.length : 0
            });
        } catch (error) {
            console.error('Error fetching data');
        }
    };

    const viewBill = async (recordId) => {
        setLoading(true);
        try {
            const response = await generateBill(recordId);
            setSelectedBill(response.data);
        } catch (error) {
            alert('Error generating bill');
        } finally {
            setLoading(false);
        }
    };

    const printBill = () => window.print();

    return (
        <div className="page-content payment-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="title-icon">💳</span>
                        Payments & Billing
                    </h1>
                    <p className="page-subtitle">View payment history and generate bills</p>
                </div>
            </div>

            {/* Revenue Stats */}
            <div className="revenue-stats">
                <div className="revenue-card">
                    <div className="revenue-icon">💰</div>
                    <div className="revenue-info">
                        <span className="revenue-label">Total Revenue</span>
                        <span className="revenue-value">{stats.total.toLocaleString()} RWF</span>
                    </div>
                </div>
                <div className="revenue-card highlight">
                    <div className="revenue-icon">📅</div>
                    <div className="revenue-info">
                        <span className="revenue-label">Today's Revenue</span>
                        <span className="revenue-value">{stats.today.toLocaleString()} RWF</span>
                    </div>
                </div>
                <div className="revenue-card">
                    <div className="revenue-icon">📊</div>
                    <div className="revenue-info">
                        <span className="revenue-label">Average Payment</span>
                        <span className="revenue-value">{Math.round(stats.average).toLocaleString()} RWF</span>
                    </div>
                </div>
            </div>

            <div className="payments-grid">
                {/* Payment History */}
                <div className="history-card glass-card">
                    <h3 className="section-title">📜 Payment History</h3>
                    <div className="payments-list">
                        {payments.map((payment, idx) => (
                            <div key={payment.PaymentID} className="payment-item" style={{animationDelay: `${idx * 50}ms`}}>
                                <div className="payment-main">
                                    <div className="payment-plate">{payment.PlateNumber}</div>
                                    <div className="payment-driver">{payment.DriverName}</div>
                                    <div className="payment-time">
                                        {new Date(payment.PaymentDate).toLocaleString()}
                                    </div>
                                </div>
                                <div className="payment-amount">
                                    <span className="amount">{parseInt(payment.AmountPaid).toLocaleString()}</span>
                                    <span className="currency">RWF</span>
                                </div>
                            </div>
                        ))}
                        {payments.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">💳</div>
                                <p>No payments recorded yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bill Generator */}
                <div className="bill-card glass-card">
                    <h3 className="section-title">🧾 Generate Bill</h3>
                    {!selectedBill ? (
                        <div className="bill-list">
                            <p className="bill-instruction">Select a completed parking session:</p>
                            {records.map(record => (
                                <button
                                    key={record.RecordID}
                                    onClick={() => viewBill(record.RecordID)}
                                    disabled={loading}
                                    className="bill-select-btn"
                                >
                                    <div className="bill-select-info">
                                        <span className="bill-plate">{record.PlateNumber}</span>
                                        <span className="bill-time">
                                            {new Date(record.EntryTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className="bill-arrow">→</span>
                                </button>
                            ))}
                            {records.length === 0 && (
                                <div className="empty-state">
                                    <p>No completed sessions</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bill-display" id="bill">
                            <div className="bill-paper">
                                <div className="bill-header">
                                    <h2>SmartPark</h2>
                                    <p>Parking Receipt</p>
                                    <div className="bill-divider"></div>
                                </div>
                                
                                <div className="bill-body">
                                    <div className="bill-row">
                                        <span>Plate Number</span>
                                        <strong>{selectedBill.PlateNumber}</strong>
                                    </div>
                                    <div className="bill-row">
                                        <span>Driver</span>
                                        <strong>{selectedBill.DriverName}</strong>
                                    </div>
                                    <div className="bill-row">
                                        <span>Entry</span>
                                        <strong>{new Date(selectedBill.EntryTime).toLocaleString()}</strong>
                                    </div>
                                    <div className="bill-row">
                                        <span>Exit</span>
                                        <strong>{new Date(selectedBill.ExitTime).toLocaleString()}</strong>
                                    </div>
                                    <div className="bill-row">
                                        <span>Duration</span>
                                        <strong>{selectedBill.Duration} min ({selectedBill.DurationHours} hrs)</strong>
                                    </div>
                                    
                                    <div className="bill-divider"></div>
                                    
                                    <div className="bill-row total">
                                        <span>Total Amount</span>
                                        <strong className="total-amount">{selectedBill.AmountPaid.toLocaleString()} RWF</strong>
                                    </div>
                                </div>
                                
                                <div className="bill-footer">
                                    <p>Thank you for parking with us!</p>
                                    <p className="bill-location">Rubavu District, Western Province</p>
                                </div>
                            </div>
                            
                            <div className="bill-actions no-print">
                                <button onClick={printBill} className="btn btn-primary">
                                    🖨️ Print Bill
                                </button>
                                <button onClick={() => setSelectedBill(null)} className="btn btn-secondary">
                                    ← Back
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .payment-page {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .revenue-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .revenue-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .revenue-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }

                .revenue-card.highlight {
                    background: var(--primary-gradient);
                    color: white;
                }

                .revenue-icon {
                    width: 56px;
                    height: 56px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.75rem;
                }

                .revenue-info {
                    display: flex;
                    flex-direction: column;
                }

                .revenue-label {
                    font-size: 0.875rem;
                    opacity: 0.9;
                    font-weight: 600;
                }

                .revenue-value {
                    font-size: 1.5rem;
                    font-weight: 800;
                }

                .payments-grid {
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 1.5rem;
                }

                .history-card, .bill-card {
                    padding: 1.5rem;
                }

                .section-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: var(--gray-800);
                    margin: 0 0 1.5rem 0;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid var(--gray-100);
                }

                .payments-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    max-height: 600px;
                    overflow-y: auto;
                }

                .payment-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.25rem;
                    background: var(--gray-50);
                    border-radius: 12px;
                    border-left: 4px solid var(--primary-500);
                    animation: slideInLeft 0.3s ease-out;
                }

                .payment-plate {
                    font-family: 'Courier New', monospace;
                    font-weight: 800;
                    color: var(--gray-900);
                    font-size: 1.125rem;
                }

                .payment-driver {
                    font-size: 0.875rem;
                    color: var(--gray-600);
                    margin-top: 0.25rem;
                }

                .payment-time {
                    font-size: 0.75rem;
                    color: var(--gray-400);
                    margin-top: 0.25rem;
                }

                .payment-amount {
                    text-align: right;
                }

                .payment-amount .amount {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--primary-600);
                    display: block;
                }

                .payment-amount .currency {
                    font-size: 0.75rem;
                    color: var(--gray-500);
                    font-weight: 600;
                }

                .bill-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .bill-instruction {
                    color: var(--gray-500);
                    margin-bottom: 1rem;
                    font-size: 0.875rem;
                }

                .bill-select-btn {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: white;
                    border: 2px solid var(--gray-200);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .bill-select-btn:hover {
                    border-color: var(--primary-500);
                    background: rgba(99, 102, 241, 0.05);
                }

                .bill-plate {
                    font-weight: 700;
                    color: var(--gray-900);
                    display: block;
                }

                .bill-time {
                    font-size: 0.875rem;
                    color: var(--gray-500);
                }

                .bill-arrow {
                    color: var(--primary-500);
                    font-weight: 700;
                }

                .bill-display {
                    animation: fadeIn 0.3s ease;
                }

                .bill-paper {
                    background: white;
                    border-radius: 12px;
                    padding: 1.5rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    margin-bottom: 1rem;
                }

                .bill-header {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }

                .bill-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    background: var(--primary-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .bill-header p {
                    margin: 0.25rem 0 0 0;
                    color: var(--gray-500);
                    font-size: 0.875rem;
                }

                .bill-divider {
                    height: 2px;
                    background: repeating-linear-gradient(
                        90deg,
                        var(--gray-300) 0px,
                        var(--gray-300) 5px,
                        transparent 5px,
                        transparent 10px
                    );
                    margin: 1rem 0;
                }

                .bill-body {
                    margin-bottom: 1.5rem;
                }

                .bill-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                    font-size: 0.875rem;
                }

                .bill-row span {
                    color: var(--gray-500);
                }

                .bill-row strong {
                    color: var(--gray-900);
                    font-weight: 600;
                }

                .bill-row.total {
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 2px solid var(--gray-200);
                }

                .total-amount {
                    font-size: 1.5rem !important;
                    color: var(--primary-600) !important;
                }

                .bill-footer {
                    text-align: center;
                    color: var(--gray-500);
                    font-size: 0.875rem;
                }

                .bill-footer p {
                    margin: 0.25rem 0;
                }

                .bill-location {
                    font-size: 0.75rem;
                    color: var(--gray-400);
                }

                .bill-actions {
                    display: flex;
                    gap: 0.75rem;
                }

                @media (max-width: 1024px) {
                    .revenue-stats {
                        grid-template-columns: 1fr;
                    }

                    .payments-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media print {
                    .bill-paper {
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Payment;
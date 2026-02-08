import { useState } from 'react';
import { getDailyReport } from '../api/paymentApi';

const Reports = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateReport = async () => {
        setLoading(true);
        try {
            const response = await getDailyReport(date);
            setReport(response.data);
        } catch (error) {
            alert('Error generating report');
        } finally {
            setLoading(false);
        }
    };

    const printReport = () => window.print();

    const downloadCSV = () => {
        if (!report) return;
        const csv = [
            ['Plate Number', 'Driver Name', 'Entry Time', 'Exit Time', 'Duration (min)', 'Amount (RWF)'],
            ...report.payments.map(p => [
                p.PlateNumber,
                p.DriverName,
                new Date(p.EntryTime).toLocaleString(),
                new Date(p.ExitTime).toLocaleString(),
                p.Duration,
                p.AmountPaid
            ])
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `parking-report-${date}.csv`;
        a.click();
    };

    return (
        <div className="page-content reports-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <span className="title-icon">📊</span>
                        Daily Reports
                    </h1>
                    <p className="page-subtitle">Generate and export parking sales reports</p>
                </div>
            </div>

            {/* Controls */}
            <div className="controls-card glass-card">
                <div className="date-picker">
                    <label>Select Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div className="control-actions">
                    <button onClick={generateReport} disabled={loading} className="btn btn-primary">
                        {loading ? <div className="spinner"></div> : '📈 Generate Report'}
                    </button>
                </div>
            </div>

            {report && (
                <div className="report-output" id="report">
                    {/* Summary Cards */}
                    <div className="summary-grid">
                        <div className="summary-card">
                            <div className="summary-icon blue">🚗</div>
                            <div className="summary-info">
                                <span className="summary-value">{report.totalPayments}</span>
                                <span className="summary-label">Total Vehicles</span>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-icon green">💰</div>
                            <div className="summary-info">
                                <span className="summary-value">{report.totalAmount.toLocaleString()}</span>
                                <span className="summary-label">Total Revenue (RWF)</span>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-icon purple">⏱️</div>
                            <div className="summary-info">
                                <span className="summary-value">
                                    {report.totalPayments ? Math.round(report.payments.reduce((acc, p) => acc + p.Duration, 0) / report.totalPayments) : 0}m
                                </span>
                                <span className="summary-label">Avg Duration</span>
                            </div>
                        </div>
                        <div className="summary-card">
                            <div className="summary-icon orange">📊</div>
                            <div className="summary-info">
                                <span className="summary-value">
                                    {report.totalPayments ? Math.round(report.totalAmount / report.totalPayments) : 0}
                                </span>
                                <span className="summary-label">Avg Payment (RWF)</span>
                            </div>
                        </div>
                    </div>

                    {/* Report Table */}
                    <div className="report-table-card glass-card">
                        <div className="table-header">
                            <h3>Transaction Details - {report.date}</h3>
                            <div className="export-actions no-print">
                                <button onClick={downloadCSV} className="btn btn-secondary btn-sm">
                                    📥 Export CSV
                                </button>
                                <button onClick={printReport} className="btn btn-primary btn-sm">
                                    🖨️ Print
                                </button>
                            </div>
                        </div>

                        <div className="table-scroll">
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Plate Number</th>
                                        <th>Driver</th>
                                        <th>Entry Time</th>
                                        <th>Exit Time</th>
                                        <th>Duration</th>
                                        <th className="numeric">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.payments.map((payment, index) => (
                                        <tr key={payment.PaymentID}>
                                            <td>{index + 1}</td>
                                            <td className="plate-cell">{payment.PlateNumber}</td>
                                            <td>{payment.DriverName}</td>
                                            <td>{new Date(payment.EntryTime).toLocaleString()}</td>
                                            <td>{new Date(payment.ExitTime).toLocaleString()}</td>
                                            <td>{payment.Duration} min</td>
                                            <td className="numeric amount-cell">{parseInt(payment.AmountPaid).toLocaleString()} RWF</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="6" className="total-label">TOTAL REVENUE</td>
                                        <td className="numeric total-amount">{report.totalAmount.toLocaleString()} RWF</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {report.payments.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">📭</div>
                                <h3>No transactions found</h3>
                                <p>No payments were recorded for this date</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="report-footer no-print">
                        <p>Report generated on {new Date().toLocaleString()}</p>
                    </div>
                </div>
            )}

            <style>{`
                .reports-page {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .controls-card {
                    padding: 1.5rem;
                    display: flex;
                    gap: 1.5rem;
                    align-items: flex-end;
                    margin-bottom: 1.5rem;
                }

                .date-picker {
                    flex: 1;
                    max-width: 300px;
                }

                .date-picker label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--gray-700);
                    margin-bottom: 0.5rem;
                }

                .control-actions {
                    display: flex;
                    gap: 0.75rem;
                }

                .btn-sm {
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .summary-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .summary-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }

                .summary-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.75rem;
                }

                .summary-icon.blue { background: rgba(59, 130, 246, 0.1); }
                .summary-icon.green { background: rgba(16, 185, 129, 0.1); }
                .summary-icon.purple { background: rgba(139, 92, 246, 0.1); }
                .summary-icon.orange { background: rgba(245, 158, 11, 0.1); }

                .summary-info {
                    display: flex;
                    flex-direction: column;
                }

                .summary-value {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--gray-900);
                }

                .summary-label {
                    font-size: 0.875rem;
                    color: var(--gray-500);
                    font-weight: 600;
                }

                .report-table-card {
                    padding: 1.5rem;
                    overflow: hidden;
                }

                .table-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .table-header h3 {
                    margin: 0;
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: var(--gray-800);
                }

                .export-actions {
                    display: flex;
                    gap: 0.75rem;
                }

                .table-scroll {
                    overflow-x: auto;
                }

                .report-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .report-table th {
                    background: var(--gray-50);
                    padding: 1rem;
                    text-align: left;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--gray-500);
                    border-bottom: 2px solid var(--gray-200);
                }

                .report-table td {
                    padding: 1rem;
                    border-bottom: 1px solid var(--gray-100);
                    font-size: 0.875rem;
                }

                .report-table tbody tr:hover {
                    background: var(--gray-50);
                }

                .report-table .numeric {
                    text-align: right;
                    font-family: 'Courier New', monospace;
                    font-weight: 600;
                }

                .plate-cell {
                    font-family: 'Courier New', monospace;
                    font-weight: 700;
                    background: var(--gray-900);
                    color: white;
                    padding: 0.25rem 0.75rem !important;
                    border-radius: 6px;
                    display: inline-block;
                }

                .amount-cell {
                    color: var(--primary-600);
                    font-weight: 700;
                }

                .report-table tfoot td {
                    border-top: 2px solid var(--gray-300);
                    background: var(--gray-50);
                    font-weight: 700;
                }

                .total-label {
                    text-align: right;
                    font-size: 0.875rem;
                    color: var(--gray-600);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .total-amount {
                    font-size: 1.125rem !important;
                    color: var(--primary-600) !important;
                }

                .report-footer {
                    text-align: center;
                    margin-top: 1.5rem;
                    color: var(--gray-500);
                    font-size: 0.875rem;
                }

                @media (max-width: 1024px) {
                    .summary-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .controls-card {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .date-picker {
                        max-width: none;
                    }

                    .summary-grid {
                        grid-template-columns: 1fr;
                    }

                    .table-header {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .export-actions {
                        justify-content: stretch;
                    }

                    .export-actions button {
                        flex: 1;
                    }
                }

                @media print {
                    .report-table-card {
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Reports;
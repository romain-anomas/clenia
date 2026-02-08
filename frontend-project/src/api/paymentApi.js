import api from './axiosConfig';

export const getAllPayments = () => api.get('/payments');
export const getPaymentById = (paymentId) => api.get(`/payments/${paymentId}`);
export const createPayment = (paymentData) => api.post('/payments', paymentData);
export const getDailyReport = (date) => api.get('/payments/daily-report', { params: { date } });
export const generateBill = (recordId) => api.get(`/payments/bill/${recordId}`);
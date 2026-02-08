import api from './axiosConfig';

export const getAllSlots = () => api.get('/parking-slots');
export const getAvailableSlots = () => api.get('/parking-slots/available');
export const createSlot = (slotData) => api.post('/parking-slots', slotData);
export const updateSlot = (slotNumber, slotData) => api.put(`/parking-slots/${slotNumber}`, slotData);
export const deleteSlot = (slotNumber) => api.delete(`/parking-slots/${slotNumber}`);
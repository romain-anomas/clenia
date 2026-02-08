import api from './axiosConfig';

export const getAllRecords = () => api.get('/parking-records');
export const getActiveRecords = () => api.get('/parking-records/active');
export const getRecordById = (recordId) => api.get(`/parking-records/${recordId}`);
export const createEntry = (entryData) => api.post('/parking-records/entry', entryData);
export const updateExit = (recordId, exitData) => api.put(`/parking-records/exit/${recordId}`, exitData);
export const deleteRecord = (recordId) => api.delete(`/parking-records/${recordId}`);
import api from './axiosConfig';

export const getAllCars = () => api.get('/cars');
export const getCarByPlate = (plateNumber) => api.get(`/cars/${plateNumber}`);
export const createCar = (carData) => api.post('/cars', carData);
export const updateCar = (plateNumber, carData) => api.put(`/cars/${plateNumber}`, carData);
export const deleteCar = (plateNumber) => api.delete(`/cars/${plateNumber}`);
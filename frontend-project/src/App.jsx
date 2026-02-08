import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyles from './components/GlobalStyles';
import Login from './pages/Login';
import Car from './pages/Car';
import ParkingSlot from './pages/ParkingSlot';
import ParkingRecord from './pages/ParkingRecord';
import Payment from './pages/Payment';
import Reports from './pages/Reports';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <>
            <GlobalStyles />
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="/parking-records" replace />} />
                        <Route path="cars" element={<Car />} />
                        <Route path="parking-slots" element={<ParkingSlot />} />
                        <Route path="parking-records" element={<ParkingRecord />} />
                        <Route path="payments" element={<Payment />} />
                        <Route path="reports" element={<Reports />} />
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;
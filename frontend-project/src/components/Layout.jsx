import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="layout">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            
            <style>{`
                .layout {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    background-attachment: fixed;
                }

                .main-content {
                    padding: 88px 1.5rem 2rem;
                    max-width: 1600px;
                    margin: 0 auto;
                }

                @media (max-width: 640px) {
                    .main-content {
                        padding: 80px 1rem 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Layout;
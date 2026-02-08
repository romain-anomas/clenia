const GlobalStyles = () => (
    <style>{`
        /* ===== CSS VARIABLES & DESIGN SYSTEM ===== */
        :root {
            /* Primary Colors */
            --primary-500: #6366f1;
            --primary-600: #4f46e5;
            --primary-700: #4338ca;
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --primary-glow: rgba(99, 102, 241, 0.3);
            
            /* Secondary Colors */
            --secondary-500: #ec4899;
            --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            
            /* Success Colors */
            --success-500: #10b981;
            --success-bg: rgba(16, 185, 129, 0.1);
            
            /* Warning Colors */
            --warning-500: #f59e0b;
            --warning-bg: rgba(245, 158, 11, 0.1);
            
            /* Error Colors */
            --error-500: #ef4444;
            --error-bg: rgba(239, 68, 68, 0.1);
            
            /* Neutral Colors */
            --gray-50: #f9fafb;
            --gray-100: #f3f4f6;
            --gray-200: #e5e7eb;
            --gray-300: #d1d5db;
            --gray-400: #9ca3af;
            --gray-500: #6b7280;
            --gray-600: #4b5563;
            --gray-700: #374151;
            --gray-800: #1f2937;
            --gray-900: #111827;
            
            /* Glass Effect */
            --glass-bg: rgba(255, 255, 255, 0.9);
            --glass-border: rgba(255, 255, 255, 0.5);
            --glass-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
            
            /* Shadows */
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            --shadow-glow: 0 0 40px var(--primary-glow);
            
            /* Border Radius */
            --radius-sm: 6px;
            --radius-md: 10px;
            --radius-lg: 16px;
            --radius-xl: 24px;
            --radius-full: 9999px;
            
            /* Transitions */
            --transition-fast: 150ms ease;
            --transition-base: 250ms ease;
            --transition-slow: 350ms ease;
            
            /* Spacing */
            --space-1: 0.25rem;
            --space-2: 0.5rem;
            --space-3: 0.75rem;
            --space-4: 1rem;
            --space-5: 1.25rem;
            --space-6: 1.5rem;
            --space-8: 2rem;
            --space-10: 2.5rem;
            --space-12: 3rem;
        }

        /* ===== ANIMATIONS ===== */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
        }

        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
        }

        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px var(--primary-glow); }
            50% { box-shadow: 0 0 20px var(--primary-glow), 0 0 40px var(--primary-glow); }
        }

        /* ===== UTILITY CLASSES ===== */
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.5s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.5s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        .animate-pulse { animation: pulse 2s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-glow { animation: glow 2s infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }

        /* Glass Card */
        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-xl);
            box-shadow: var(--glass-shadow);
        }

        /* Gradient Text */
        .gradient-text {
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Hover Lift */
        .hover-lift {
            transition: transform var(--transition-base), box-shadow var(--transition-base);
        }
        .hover-lift:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-xl);
        }

        /* Button Styles */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            border-radius: var(--radius-md);
            transition: all var(--transition-base);
            cursor: pointer;
            border: none;
            font-size: 0.875rem;
        }

        .btn-primary {
            background: var(--primary-gradient);
            color: white;
            box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
        }

        .btn-secondary {
            background: white;
            color: var(--gray-700);
            border: 2px solid var(--gray-200);
        }
        .btn-secondary:hover {
            border-color: var(--primary-500);
            color: var(--primary-600);
        }

        .btn-success {
            background: var(--success-500);
            color: white;
        }
        .btn-danger {
            background: var(--error-500);
            color: white;
        }

        .btn-icon {
            width: 2.5rem;
            height: 2.5rem;
            padding: 0;
            border-radius: var(--radius-md);
        }

        /* Input Styles */
        .input-field {
            width: 100%;
            padding: 0.875rem 1rem;
            border: 2px solid var(--gray-200);
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            transition: all var(--transition-base);
            background: white;
        }
        .input-field:focus {
            outline: none;
            border-color: var(--primary-500);
            box-shadow: 0 0 0 4px var(--primary-glow);
        }

        /* Status Badges */
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius-full);
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }

        .badge-success {
            background: var(--success-bg);
            color: var(--success-500);
        }

        .badge-warning {
            background: var(--warning-bg);
            color: var(--warning-500);
        }

        .badge-danger {
            background: var(--error-bg);
            color: var(--error-500);
        }

        .badge-primary {
            background: rgba(99, 102, 241, 0.1);
            color: var(--primary-600);
        }

        /* Card Styles */
        .stat-card {
            background: white;
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            box-shadow: var(--shadow-md);
            transition: all var(--transition-base);
            border: 1px solid var(--gray-100);
        }
        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-xl);
        }

        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
        }

        /* Table Styles */
        .data-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
        }

        .data-table th {
            background: var(--gray-50);
            padding: 1rem;
            text-align: left;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--gray-500);
            border-bottom: 2px solid var(--gray-200);
        }

        .data-table td {
            padding: 1rem;
            border-bottom: 1px solid var(--gray-100);
            font-size: 0.875rem;
            color: var(--gray-700);
        }

        .data-table tr {
            transition: background var(--transition-fast);
        }

        .data-table tbody tr:hover {
            background: var(--gray-50);
        }

        /* Page Transition */
        .page-content {
            animation: fadeIn 0.5s ease-out;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--gray-100);
            border-radius: var(--radius-full);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--gray-400);
            border-radius: var(--radius-full);
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--gray-500);
        }

        /* Loading Skeleton */
        .skeleton {
            background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: var(--radius-md);
        }

        /* Toast Notification */
        .toast {
            position: fixed;
            top: 1rem;
            right: 1rem;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            background: white;
            box-shadow: var(--shadow-xl);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideInRight 0.3s ease-out;
            z-index: 1000;
        }

        .toast-success {
            border-left: 4px solid var(--success-500);
        }

        .toast-error {
            border-left: 4px solid var(--error-500);
        }

        /* Print Styles */
        @media print {
            .no-print { display: none !important; }
            .page-content { animation: none; }
        }
    `}</style>
);

export default GlobalStyles;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isScenario = location.pathname === '/scenario';

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-blue-100 dark:border-blue-900/50 shadow-sm p-1">
        <div className="flex gap-1">
          <button
            onClick={() => navigate('/')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              !isScenario
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            아이디어 생성기
          </button>
          <button
            onClick={() => navigate('/scenario')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              isScenario
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            AX 시나리오 생성기
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import type { User } from '../types';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
}

const GoldIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FDE047', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="url(#gold-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7L12 12M12 12L22 7M12 12V22M12 2V12" stroke="url(#gold-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 4.5L7 9.5" stroke="url(#gold-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1 && names[1]) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};


export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    return (
        <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 border-b border-gray-700/50">
                    <div className="flex items-center space-x-3">
                        <GoldIcon />
                        <h1 className="text-xl font-bold tracking-tight text-white" style={{fontFamily: "'Playfair Display', serif"}}>
                            GoldPayments
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center ring-2 ring-amber-400">
                           {user && <span className="text-sm font-bold text-gray-900">{getInitials(user.name)}</span>}
                        </div>
                        <button onClick={onLogout} className="text-sm text-gray-400 hover:text-white transition-colors">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
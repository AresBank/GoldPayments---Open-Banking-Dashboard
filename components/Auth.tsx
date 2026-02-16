
import React, { useState } from 'react';

interface AuthProps {
    onRegister: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    onLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
}

const GoldIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export const Auth: React.FC<AuthProps> = ({ onRegister, onLogin }) => {
    const [isRegister, setIsRegister] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        let result;
        if (isRegister) {
            result = await onRegister(name, email, password);
        } else {
            result = await onLogin(email, password);
        }

        if (!result.success) {
            setError(result.message || 'Ocurrió un error.');
        }
        
        setIsLoading(false);
    };
    
    const toggleMode = () => {
        setIsRegister(!isRegister);
        setError(null);
        setName('');
        setEmail('');
        setPassword('');
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <GoldIcon />
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-lg shadow-amber-500/5">
                    <h2 className="text-2xl font-bold text-center text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    </h2>
                    <p className="text-center text-gray-400 mb-6 text-sm">
                        {isRegister ? 'Únete a la nueva era de las finanzas.' : 'Bienvenido de vuelta.'}
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isRegister && (
                            <div>
                                <label className="text-sm font-medium text-gray-400 block mb-2" htmlFor="name">Nombre Completo</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                />
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium text-gray-400 block mb-2" htmlFor="email">Correo Electrónico</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-400 block mb-2" htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                        </div>

                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                        <button type="submit" disabled={isLoading} className="w-full mt-6 bg-amber-400 text-gray-900 font-bold py-2 rounded-md hover:bg-amber-300 transition-colors disabled:bg-gray-500">
                            {isLoading ? 'Cargando...' : (isRegister ? 'Crear Cuenta' : 'Entrar')}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
                        <button onClick={toggleMode} className="font-medium text-amber-400 hover:text-amber-300 ml-1">
                            {isRegister ? 'Inicia Sesión' : 'Regístrate'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

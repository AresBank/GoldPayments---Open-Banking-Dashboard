
import React, { useState } from 'react';
import { MOCK_INSTITUTIONS } from '../constants';

interface LinkAccountModalProps {
    onClose: () => void;
    onAccountLinked: (institution: string) => void;
}

enum LinkStep {
    Consent,
    InstitutionSelect,
    BankLogin,
    Biometric,
    Success
}

export const LinkAccountModal: React.FC<LinkAccountModalProps> = ({ onClose, onAccountLinked }) => {
    const [step, setStep] = useState<LinkStep>(LinkStep.Consent);
    const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [bankUser, setBankUser] = useState('');
    const [bankPass, setBankPass] = useState('');

    const handleSelectInstitution = (name: string) => {
        setSelectedInstitution(name);
        setStep(LinkStep.BankLogin);
    };

    const handleBankAuthorization = () => {
        setStep(LinkStep.Biometric);
    };

    const handleBiometricAuth = () => {
        // Simulate auth
        setTimeout(() => {
            if(selectedInstitution) {
                onAccountLinked(selectedInstitution);
            }
            setStep(LinkStep.Success);
            setTimeout(() => {
                onClose();
            }, 2000);
        }, 1500);
    };
    
    const renderStep = () => {
        switch(step) {
            case LinkStep.Consent:
                return (
                    <div>
                        <h3 className="text-lg font-bold text-amber-300">Vincular cuenta bancaria</h3>
                        <p className="mt-2 text-sm text-gray-400">GoldPayments requiere acceso de lectura para sincronizar tus saldos y movimientos de forma segura.</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-300 list-disc list-inside">
                            <li>Ver saldos de tus cuentas</li>
                            <li>Consultar historial de transacciones</li>
                            <li>Verificación de datos de la cuenta</li>
                        </ul>
                        <p className="mt-4 text-xs text-gray-500">Nunca compartiremos tus credenciales de acceso.</p>
                        <button onClick={() => setStep(LinkStep.InstitutionSelect)} className="w-full mt-6 bg-amber-400 text-gray-900 font-bold py-2 rounded-md hover:bg-amber-300 transition-colors">
                            Aceptar y Continuar
                        </button>
                    </div>
                );
            case LinkStep.InstitutionSelect:
                const filteredInstitutions = MOCK_INSTITUTIONS.filter(inst =>
                    inst.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                return (
                    <div>
                        <h3 className="text-lg font-bold text-amber-300">Selecciona tu institución</h3>
                        <div className="mt-4 relative">
                            <input
                                type="text"
                                placeholder="Buscar banco..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 h-64 overflow-y-auto pr-2">
                            {filteredInstitutions.length > 0 ? (
                                filteredInstitutions.map(inst => {
                                    const Logo = inst.logo;
                                    return (
                                        <button key={inst.name} onClick={() => handleSelectInstitution(inst.name)} className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors h-28">
                                            <Logo className="h-10 w-10 mb-2"/>
                                            <span className="text-sm font-medium text-white text-center">{inst.name}</span>
                                        </button>
                                    )
                                })
                            ) : (
                                <p className="col-span-full text-center text-gray-400 mt-8">No se encontraron resultados.</p>
                            )}
                        </div>
                    </div>
                );
            case LinkStep.BankLogin:
                const institution = MOCK_INSTITUTIONS.find(inst => inst.name === selectedInstitution);
                const Logo = institution?.logo;
                const isFormInvalid = bankUser.trim() === '' || bankPass.trim() === '';
                return (
                    <div>
                        <h3 className="text-lg font-bold text-amber-300 text-center">Conectando con {selectedInstitution}</h3>
                        <div className="flex justify-center my-6">
                            {Logo && <Logo className="h-16 w-16" />}
                        </div>
                        <p className="text-center text-sm text-gray-400 mb-6">Ingresa tus credenciales de forma segura para autorizar la conexión.</p>
                        <form onSubmit={(e) => { e.preventDefault(); if (!isFormInvalid) handleBankAuthorization(); }}>
                            <div className="space-y-4">
                                 <div>
                                    <label className="text-sm font-medium text-gray-400 block mb-2" htmlFor="bank-user">CLABE / Número de Tarjeta</label>
                                    <input 
                                        id="bank-user" 
                                        type="text"
                                        value={bankUser}
                                        onChange={(e) => setBankUser(e.target.value.replace(/\D/g, ''))}
                                        maxLength={18}
                                        required
                                        placeholder="Ej. 012345678901234567"
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white" />
                                </div>
                                 <div>
                                    <label className="text-sm font-medium text-gray-400 block mb-2" htmlFor="bank-pass">Token / Contraseña</label>
                                    <input 
                                        id="bank-pass" 
                                        type="password"
                                        value={bankPass}
                                        onChange={(e) => setBankPass(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white" />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isFormInvalid}
                                className="w-full mt-8 bg-amber-400 text-gray-900 font-bold py-2 rounded-md hover:bg-amber-300 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                                Autorizar Conexión
                            </button>
                        </form>
                    </div>
                );
            case LinkStep.Biometric:
                return (
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-amber-300">Autenticación Biométrica</h3>
                        <p className="mt-2 text-sm text-gray-400">Confirma tu identidad para vincular tu cuenta de {selectedInstitution}.</p>
                        <div className="my-8 flex justify-center">
                            <svg className="w-20 h-20 text-amber-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.789-2.75 9.565M12 11c0-3.517.034-6.789 2.75-9.565M12 11h.01M4.832 5.178A9.003 9.003 0 003 12c0 1.695.454 3.29.986 4.618M19.168 18.822A9.003 9.003 0 0021 12c0-1.695-.454-3.29-.986-4.618M4.5 19.5a8.96 8.96 0 01-1.424-4.5M19.5 4.5a8.96 8.96 0 011.424 4.5" />
                            </svg>
                        </div>
                        <button onClick={handleBiometricAuth} className="w-full mt-6 bg-amber-400 text-gray-900 font-bold py-2 rounded-md hover:bg-amber-300 transition-colors">
                            Autenticar
                        </button>
                    </div>
                );
            case LinkStep.Success:
                return (
                    <div className="text-center">
                        <svg className="w-16 h-16 mx-auto text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-bold text-green-400">¡Cuenta Vinculada!</h3>
                        <p className="mt-2 text-sm text-gray-400">Tu cuenta de {selectedInstitution} ha sido agregada exitosamente.</p>
                    </div>
                );
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {renderStep()}
            </div>
        </div>
    );
};
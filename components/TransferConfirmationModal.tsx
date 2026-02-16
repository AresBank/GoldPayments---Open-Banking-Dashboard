
import React from 'react';

interface TransferDetails {
    amount: number;
    beneficiary: string;
    destinationClabe: string;
    destinationBank: string;
    concept: string;
    sourceAccountName: string;
    currency: string;
}

interface TransferConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    details: TransferDetails;
}

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
};

export const TransferConfirmationModal: React.FC<TransferConfirmationModalProps> = ({ isOpen, onClose, onConfirm, details }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md relative">
                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up {
                        animation: fadeInUp 0.3s ease-out forwards;
                    }
                `}</style>
                <div className="animate-fade-in-up">
                    <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-amber-300">Confirmar Transferencia</h3>
                        <p className="mt-2 text-sm text-gray-400">Por favor, revisa los detalles antes de enviar.</p>
                    </div>

                    <div className="my-6 space-y-3 text-sm">
                        <div className="flex justify-between items-center bg-gray-700/50 p-3 rounded-md">
                            <span className="text-gray-400">Monto a Enviar</span>
                            <span className="text-2xl font-bold text-white">{formatCurrency(details.amount, details.currency)}</span>
                        </div>
                         <div className="flex justify-between items-center p-2">
                            <span className="text-gray-400">De</span>
                            <span className="font-medium text-white text-right">{details.sourceAccountName}</span>
                        </div>
                         <div className="flex justify-between items-center p-2">
                            <span className="text-gray-400">Para</span>
                            <span className="font-medium text-white text-right">{details.beneficiary}</span>
                        </div>
                         <div className="flex justify-between items-center p-2">
                            <span className="text-gray-400">CLABE Destino</span>
                            <span className="font-mono text-white text-right">{details.destinationClabe}</span>
                        </div>
                         <div className="flex justify-between items-center p-2">
                            <span className="text-gray-400">Banco Destino</span>
                            <span className="font-medium text-white text-right">{details.destinationBank}</span>
                        </div>
                         <div className="flex justify-between items-center p-2">
                            <span className="text-gray-400">Concepto</span>
                            <span className="font-medium text-white text-right">{details.concept}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button onClick={onClose} className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-md transition-colors">
                            Cancelar
                        </button>
                        <button onClick={onConfirm} className="w-full bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold py-3 rounded-md transition-colors">
                            Confirmar y Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

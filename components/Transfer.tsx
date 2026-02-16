
import React, { useState, useEffect, useMemo } from 'react';
import type { Account } from '../types';
import { BANK_CODES } from '../constants';
import { TransferConfirmationModal } from './TransferConfirmationModal';

interface TransferProps {
    accounts: Account[];
    onTransfer: (details: {
        sourceAccountId: string;
        amount: number;
        beneficiary: string;
        destinationClabe: string;
        concept: string;
        destinationBank: string;
    }) => boolean;
}

// --- Helper function for CLABE validation ---
const validateClabe = (clabe: string): boolean => {
  if (!/^\d{18}$/.test(clabe)) {
    return false;
  }
  const weightingFactors = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += (parseInt(clabe.charAt(i), 10) * weightingFactors[i]) % 10;
  }
  const calculatedControlDigit = (10 - (sum % 10)) % 10;
  const providedControlDigit = parseInt(clabe.charAt(17), 10);
  return calculatedControlDigit === providedControlDigit;
};


const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
};

export const Transfer: React.FC<TransferProps> = ({ accounts, onTransfer }) => {
    const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.id || '');
    const [beneficiary, setBeneficiary] = useState('');
    const [destinationClabe, setDestinationClabe] = useState('');
    const [amount, setAmount] = useState('');
    const [concept, setConcept] = useState('');
    
    const [detectedBank, setDetectedBank] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isClabeValid, setIsClabeValid] = useState(false);
    const [transferStatus, setTransferStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isCopied, setIsCopied] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const selectedAccount = useMemo(() => accounts.find(acc => acc.id === sourceAccountId), [accounts, sourceAccountId]);
    const primaryAccount = useMemo(() => accounts.find(acc => acc.institution === 'GoldPayments'), [accounts]);

    const handleCopyClabe = () => {
        if (primaryAccount?.accountNumber) {
            navigator.clipboard.writeText(primaryAccount.accountNumber);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    useEffect(() => {
        let clabeIsValid = false;
        // --- CLABE Bank Detection ---
        if (destinationClabe.length >= 3) {
            const bankCode = destinationClabe.substring(0, 3);
            setDetectedBank(BANK_CODES[bankCode] || 'Banco Desconocido');
        } else {
            setDetectedBank('');
        }
        
        // --- Form Validation ---
        const newErrors: { [key: string]: string } = {};
        if (!sourceAccountId) newErrors.source = "Selecciona una cuenta de origen.";
        if (beneficiary.trim().length < 3) newErrors.beneficiary = "El nombre es muy corto.";
        
        // --- Real CLABE Validation ---
        if (destinationClabe.length !== 18) {
            newErrors.clabe = "La CLABE debe tener 18 dígitos.";
        } else if (!validateClabe(destinationClabe)) {
            newErrors.clabe = "La CLABE no es válida. Verifica el dígito de control.";
        } else {
            clabeIsValid = true;
        }

        setIsClabeValid(clabeIsValid);

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) newErrors.amount = "Ingresa un monto válido.";
        if (selectedAccount && numericAmount > selectedAccount.balance.amount) newErrors.amount = "Fondos insuficientes.";
        if (concept.trim().length < 3) newErrors.concept = "El concepto es muy corto.";

        setErrors(newErrors);
        // FIX: The result of the logical AND expression can be a string, which is not assignable to a boolean state.
        // Coerce the result to a boolean to fix the type error.
        setIsFormValid(!!(Object.keys(newErrors).length === 0 && beneficiary && destinationClabe && amount && concept));
    }, [sourceAccountId, beneficiary, destinationClabe, amount, concept, selectedAccount]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || !selectedAccount) return;
        setIsConfirmModalOpen(true);
    };
    
    const handleConfirmTransfer = () => {
        setIsConfirmModalOpen(false);
        if (!isFormValid || !selectedAccount) return;

        const success = onTransfer({
            sourceAccountId,
            amount: parseFloat(amount),
            beneficiary,
            destinationClabe,
            concept,
            destinationBank: detectedBank,
        });

        if (success) {
            setTransferStatus('success');
            // Reset form
            setBeneficiary('');
            setDestinationClabe('');
            setAmount('');
            setConcept('');
            setTimeout(() => setTransferStatus('idle'), 4000);
        } else {
            setTransferStatus('error');
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <h3 className="text-lg font-medium text-white mb-3">Mi Cuenta CLABE para Recibir</h3>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
                        <p className="font-mono text-base sm:text-lg text-white tracking-wider">{primaryAccount?.accountNumber}</p>
                        <button 
                            onClick={handleCopyClabe} 
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                                isCopied 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                            }`}
                        >
                            {isCopied ? '¡Copiado!' : 'Copiar'}
                        </button>
                    </div>
                </div>
                
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Realizar Transferencia SPEI</h2>

                    {transferStatus === 'success' && (
                         <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-md mb-6" role="alert">
                            <strong className="font-bold">¡Éxito!</strong>
                            <span className="block sm:inline"> Tu transferencia ha sido enviada correctamente.</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="source-account" className="block text-sm font-medium text-gray-400 mb-2">Wallet de Origen</label>
                            <select
                                id="source-account"
                                value={sourceAccountId}
                                onChange={(e) => setSourceAccountId(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.institution} ({acc.accountName}) - {formatCurrency(acc.balance.amount, acc.balance.currency)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-400 mb-2">Nombre del Beneficiario</label>
                            <input type="text" id="beneficiary" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white" />
                            {errors.beneficiary && <p className="text-red-400 text-xs mt-1">{errors.beneficiary}</p>}
                        </div>

                        <div>
                            <label htmlFor="clabe" className="block text-sm font-medium text-gray-400 mb-2">CLABE (18 dígitos)</label>
                            <input type="text" id="clabe" maxLength={18} value={destinationClabe} onChange={(e) => setDestinationClabe(e.target.value.replace(/\D/g, ''))} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white" />
                            <div className="flex justify-between items-center mt-1 h-4">
                                {errors.clabe ? <p className="text-red-400 text-xs">{errors.clabe}</p> : <span></span>}
                                {detectedBank && (
                                    <div className="flex items-center space-x-1">
                                        {isClabeValid && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        <p className="text-amber-400 font-semibold text-xs">{detectedBank}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-2">Monto</label>
                                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white" placeholder="0.00"/>
                                 {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
                            </div>
                             <div>
                                <label htmlFor="concept" className="block text-sm font-medium text-gray-400 mb-2">Concepto de Pago</label>
                                <input type="text" id="concept" value={concept} onChange={(e) => setConcept(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white" />
                                {errors.concept && <p className="text-red-400 text-xs mt-1">{errors.concept}</p>}
                            </div>
                        </div>

                         <button
                            type="submit"
                            disabled={!isFormValid}
                            className="w-full mt-4 bg-amber-400 text-gray-900 font-bold py-3 rounded-md hover:bg-amber-300 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Transferir {amount && isFormValid ? formatCurrency(parseFloat(amount), selectedAccount?.balance.currency || 'MXN') : ''}
                        </button>
                    </form>
                </div>
            </div>
            {isConfirmModalOpen && selectedAccount && (
                <TransferConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirmTransfer}
                    details={{
                        amount: parseFloat(amount),
                        beneficiary,
                        destinationClabe,
                        destinationBank: detectedBank,
                        concept,
                        sourceAccountName: `${selectedAccount.institution} (${selectedAccount.accountName})`,
                        currency: selectedAccount.balance.currency,
                    }}
                />
            )}
        </>
    );
};

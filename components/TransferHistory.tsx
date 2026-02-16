
import React, { useState, useMemo } from 'react';
import type { Transaction, Account } from '../types';

interface TransferHistoryProps {
    transactions: Transaction[];
    accounts: Account[];
}

const ExportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    const statusMap = {
        Completada: "bg-green-500/20 text-green-300",
        Pendiente: "bg-yellow-500/20 text-yellow-300",
        Fallida: "bg-red-500/20 text-red-300",
    };
    return <span className={`${baseClasses} ${statusMap[status]}`}>{status}</span>;
};

export const TransferHistory: React.FC<TransferHistoryProps> = ({ transactions, accounts }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWallet, setSelectedWallet] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const filteredTransactions = useMemo(() => {
        const transferTxs = transactions.filter(tx => tx.amount < 0 && (tx.category === 'Transferencias' || tx.category === 'Pagos'));
        
        return transferTxs
            .filter(tx => {
                const transactionDate = new Date(tx.date);
                const startDateMatch = startDate ? transactionDate >= new Date(startDate) : true;
                const endDateMatch = endDate ? transactionDate <= new Date(endDate) : true;
                const walletMatch = selectedWallet ? tx.institution === selectedWallet : true;
                const statusMatch = selectedStatus ? tx.status === selectedStatus : true;
                const searchMatch = searchQuery 
                    ? tx.beneficiary?.toLowerCase().includes(searchQuery.toLowerCase()) || tx.description.toLowerCase().includes(searchQuery.toLowerCase())
                    : true;
                
                return startDateMatch && endDateMatch && walletMatch && statusMatch && searchMatch;
            })
            .slice(0, 20);
    }, [transactions, searchQuery, selectedWallet, startDate, endDate, selectedStatus]);

    const handleExportCSV = () => {
        const headers = ["Fecha", "Beneficiario", "Descripción", "Monto", "Moneda", "Wallet de Origen", "Estado"];
        const csvContent = [
            headers.join(','),
            ...filteredTransactions.map(tx => [
                `"${new Date(tx.date).toLocaleString('es-MX')}"`,
                `"${tx.beneficiary || ''}"`,
                `"${tx.description}"`,
                tx.amount,
                tx.currency,
                tx.institution,
                tx.status
            ].join(','))
        ].join('\n');
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'historial_transferencias.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-white">Historial de Transferencias</h3>
                <button onClick={handleExportCSV} className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-amber-400 rounded-md hover:bg-amber-300 transition-colors">
                    <ExportIcon /> Exportar a CSV
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Buscar por beneficiario..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="md:col-span-2 lg:col-span-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 text-sm"
                />
                 <select value={selectedWallet} onChange={e => setSelectedWallet(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm">
                    <option value="">Todas las Wallets</option>
                    {accounts.map(acc => <option key={acc.id} value={acc.institution}>{acc.institution}</option>)}
                </select>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm"/>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm"/>
                 <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm">
                    <option value="">Todos los Estados</option>
                    <option value="Completada">Completada</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Fallida">Fallida</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Fecha</th>
                            <th scope="col" className="px-6 py-3">Beneficiario</th>
                            <th scope="col" className="px-6 py-3 text-right">Monto</th>
                            <th scope="col" className="px-6 py-3">Wallet Origen</th>
                            <th scope="col" className="px-6 py-3 text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(tx => (
                            <tr key={tx.id} className="border-b border-gray-700 hover:bg-gray-700/40">
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{new Date(tx.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                <td className="px-6 py-4 text-white">
                                    {tx.beneficiary}
                                    <p className="text-xs text-gray-500">{tx.description}</p>
                                </td>
                                <td className="px-6 py-4 text-right font-semibold text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: tx.currency }).format(tx.amount)}</td>
                                <td className="px-6 py-4">{tx.institution}</td>
                                <td className="px-6 py-4 text-center"><StatusBadge status={tx.status} /></td>
                            </tr>
                        ))}
                         {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">No se encontraron transferencias con los filtros seleccionados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


import React, { useState } from 'react';
import type { Account, Transaction, BankFeed, ReconciliationLog } from '../types';
import { AccountCard } from './AccountCard';
import { TransactionsList } from './TransactionsList';
import { SpendingChart } from './SpendingChart';
import { TransferHistory } from './TransferHistory';
import { Transfer } from './Transfer';
import { ReconciliationDashboard } from './ReconciliationDashboard';

interface DashboardProps {
    accounts: Account[];
    transactions: Transaction[];
    bankFeeds: BankFeed[];
    reconciliationLogs: ReconciliationLog[];
    onLinkAccount: () => void;
    onMakeTransfer: (details: any) => boolean;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

export const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, bankFeeds, reconciliationLogs, onLinkAccount, onMakeTransfer }) => {
    const [activeTab, setActiveTab] = useState('summary');

    const tabClasses = (tabName: string) => 
        `px-3 py-2 font-medium text-sm rounded-md cursor-pointer transition-colors ${
            activeTab === tabName 
            ? 'bg-gray-700 text-white' 
            : 'text-gray-400 hover:text-white'
        }`;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-4">
                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex space-x-2 sm:space-x-6" aria-label="Tabs">
                        <button onClick={() => setActiveTab('summary')} className={tabClasses('summary')}>
                            Resumen
                        </button>
                         <button onClick={() => setActiveTab('transfer')} className={tabClasses('transfer')}>
                            Transferir
                        </button>
                        <button onClick={() => setActiveTab('history')} className={tabClasses('history')}>
                            Historial
                        </button>
                        <button onClick={() => setActiveTab('reconciliation')} className={tabClasses('reconciliation')}>
                            Conciliación
                        </button>
                    </nav>
                </div>
                 <button 
                    onClick={onLinkAccount}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-900 bg-amber-400 rounded-md hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 transition-all duration-200"
                >
                   <PlusIcon /> <span className="hidden sm:inline">Vincular Cuenta</span>
                </button>
            </div>

            {activeTab === 'summary' && (
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Cuentas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {accounts.map(account => (
                                <AccountCard key={account.id} account={account} />
                            ))}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <TransactionsList transactions={transactions.slice(0, 10)} />
                        </div>
                        <div>
                           <SpendingChart transactions={transactions} />
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'transfer' && (
                <Transfer accounts={accounts} onTransfer={onMakeTransfer} />
            )}

            {activeTab === 'history' && (
                <TransferHistory transactions={transactions} accounts={accounts} />
            )}

            {activeTab === 'reconciliation' && (
                <ReconciliationDashboard 
                    bankFeeds={bankFeeds} 
                    reconciliationLogs={reconciliationLogs}
                    internalTransactions={transactions}
                />
            )}
        </div>
    );
};
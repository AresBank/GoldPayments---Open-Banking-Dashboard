
import React, { useMemo } from 'react';
import type { BankFeed, ReconciliationLog, Transaction } from '../types';

interface ReconciliationDashboardProps {
    bankFeeds: BankFeed[];
    reconciliationLogs: ReconciliationLog[];
    internalTransactions: Transaction[];
}

interface JoinedLog {
    id: string;
    reconciled_at: string;
    match_score: number;
    internal_tx: {
        amount: number;
        description: string;
        status: string;
    };
    bank_feed: {
        institution_name: string;
        bank_transaction_id: string;
    };
}

const ReconciliationCard: React.FC<{ log: JoinedLog }> = ({ log }) => {
  return (
    <div className="group relative bg-[#1A1A1A] border-l-4 border-[#D4AF37] p-6 rounded-r-lg hover:bg-[#252525] transition-all duration-300 shadow-xl">
      <div className="flex justify-between items-center">
        {/* Lado Izquierdo: Info Interna */}
        <div>
          <span className="text-[10px] uppercase tracking-tighter text-[#D4AF37] font-bold">Internal Ledger</span>
          <h3 className="text-lg font-medium text-gray-200">{log.internal_tx.description}</h3>
          <p className="text-sm text-gray-500">{new Date(log.reconciled_at).toLocaleDateString()}</p>
        </div>

        {/* Lado Central: Match Score (Visual) */}
        <div className="text-center px-4">
          <div className="text-2xl font-bold text-[#D4AF37]">{log.match_score}%</div>
          <div className="text-[9px] uppercase text-gray-400">Match Accuracy</div>
        </div>

        {/* Lado Derecho: Info Bancaria (Open Banking) */}
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-tighter text-gray-400">External Bank</span>
          <h3 className="text-lg font-bold text-white">
            {Math.abs(log.internal_tx.amount).toLocaleString('en-US', { style: 'currency', currency: 'MXN' })}
          </h3>
          <p className="text-xs text-[#D4AF37] italic">{log.bank_feed.institution_name}</p>
        </div>
      </div>
      
      {/* Efecto de brillo al pasar el mouse */}
      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4-4a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-2.293 2.293a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414z" />
        </svg>
      </div>
    </div>
  );
};


export const ReconciliationDashboard: React.FC<ReconciliationDashboardProps> = ({ bankFeeds, reconciliationLogs, internalTransactions }) => {

    const reconciledData: JoinedLog[] = useMemo(() => {
        return reconciliationLogs
            .map(log => {
                const internal_tx = internalTransactions.find(tx => tx.id === log.internal_tx_id);
                const bank_feed = bankFeeds.find(bf => bf.id === log.bank_feed_id);

                if (!internal_tx || !bank_feed) {
                    return null;
                }

                return {
                    id: log.id,
                    reconciled_at: log.created_at,
                    match_score: log.match_score,
                    internal_tx: {
                        amount: internal_tx.amount,
                        description: internal_tx.description,
                        status: internal_tx.status,
                    },
                    bank_feed: {
                        institution_name: bank_feed.institution,
                        bank_transaction_id: bank_feed.description, 
                    }
                };
            })
            .filter((item): item is JoinedLog => item !== null)
            .sort((a, b) => new Date(b.reconciled_at).getTime() - new Date(a.reconciled_at).getTime());
    }, [reconciliationLogs, internalTransactions, bankFeeds]);

    return (
        <div className="text-white p-2">
            <header className="mb-10 text-center md:text-left">
                <h1 className="text-3xl font-light tracking-widest text-[#D4AF37] uppercase">
                Gold<span className="font-bold text-white">Reconciliation</span>
                </h1>
                <p className="text-gray-500 text-sm mt-2">Intelligent Reconciliation Engine v1.0</p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                {reconciledData.length > 0 ? (
                    reconciledData.map((log) => (
                        <ReconciliationCard key={log.id} log={log} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-[#1A1A1A] rounded-lg">
                        <p className="text-gray-400">No hay transacciones reconciliadas para mostrar.</p>
                        <p className="text-xs text-gray-500 mt-2">Realice una transferencia para ver el motor en acción.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

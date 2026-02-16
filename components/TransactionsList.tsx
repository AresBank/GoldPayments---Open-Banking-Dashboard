
import React from 'react';
import type { Transaction } from '../types';
import { ShoppingBagIcon, ArrowDownIcon, ArrowUpIcon, CurrencyDollarIcon, FilmIcon, TruckIcon } from './icons/CategoryIcons';
import { BanamexLogo, BbvaLogo, SantanderLogo, GoldPaymentsLogo, HsbcLogo, StpLogo, MercadoPagoLogo } from './icons/BankLogos';

interface TransactionsListProps {
    transactions: Transaction[];
}

const categoryIconMap: { [key: string]: React.ReactNode } = {
    'Compras': <ShoppingBagIcon />,
    'Ingresos': <ArrowDownIcon />,
    'Transferencias': <ArrowUpIcon />,
    'Pagos': <CurrencyDollarIcon />,
    'Entretenimiento': <FilmIcon />,
    'Comida': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.993.883L4 8v9a1 1 0 001 1h10a1 1 0 001-1V8l-.007-.117A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5H8V6a2 2 0 114 0v1z" /></svg>,
    'Transporte': <TruckIcon />,
};

const bankLogoMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    'GoldPayments': GoldPaymentsLogo,
    'Banamex': BanamexLogo,
    'BBVA': BbvaLogo,
    'Santander': SantanderLogo,
    'HSBC': HsbcLogo,
    'STP': StpLogo,
    'Mercado Pago': MercadoPagoLogo,
};

const formatCurrency = (amount: number, currency: string) => {
    const value = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(Math.abs(amount));
    return amount < 0 ? `- ${value}` : `+ ${value}`;
};

export const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Últimos Movimientos</h3>
            <div className="flow-root">
                <ul role="list" className="-mb-4">
                    {transactions.map((tx, index) => {
                        const Logo = bankLogoMap[tx.institution];
                        return (
                        <li key={tx.id}>
                            <div className={`relative ${index < transactions.length - 1 ? 'pb-6' : ''}`}>
                                {index < transactions.length - 1 ? (
                                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-600" aria-hidden="true" />
                                ) : null}
                                <div className="relative flex items-center space-x-4">
                                    <span className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center ring-4 ring-gray-800">
                                        {categoryIconMap[tx.category] || <CurrencyDollarIcon />}
                                    </span>
                                    <div className="min-w-0 flex-1 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-white">{tx.description}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(tx.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}
                                            </p>
                                        </div>
                                        <div className="text-right flex items-center space-x-2">
                                           {Logo && <Logo className="h-5 w-5 hidden sm:block" />}
                                            <p className={`text-sm font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-gray-300'}`}>
                                                {formatCurrency(tx.amount, tx.currency)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )})}
                </ul>
            </div>
        </div>
    );
};

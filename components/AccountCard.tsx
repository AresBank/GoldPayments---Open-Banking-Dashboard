
import React from 'react';
import type { Account } from '../types';
import { BanamexLogo, BbvaLogo, SantanderLogo, GoldPaymentsLogo, HsbcLogo, StpLogo, MercadoPagoLogo } from './icons/BankLogos';

interface AccountCardProps {
    account: Account;
}

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
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
};

const TimeAgo = ({ dateString }: { dateString: string }) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 3600;
    if (interval > 1) {
        return `hace ${Math.floor(interval)} horas`;
    }
    interval = seconds / 60;
    if (interval > 1) {
        return `hace ${Math.floor(interval)} minutos`;
    }
    return `hace ${Math.floor(seconds)} segundos`;
};


export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
    const Logo = bankLogoMap[account.institution] || GoldPaymentsLogo;
    const isPrimary = account.institution === 'GoldPayments';

    const cardClasses = `
        rounded-xl p-6 flex flex-col justify-between h-full transition-all duration-300
        ${isPrimary 
            ? 'bg-gradient-to-br from-amber-400/10 to-amber-500/5 border border-amber-400/50 shadow-lg shadow-amber-500/10' 
            : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'}
    `;

    return (
        <div className={cardClasses}>
            <div>
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                            <Logo className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">{account.institution}</p>
                            <p className="text-sm text-gray-400">{account.accountName}</p>
                        </div>
                    </div>
                    <span className="text-xs font-medium bg-green-500/20 text-green-300 px-2 py-1 rounded-full">{account.status}</span>
                </div>
                <div className="mt-6 text-left">
                    <p className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                        {formatCurrency(account.balance.amount, account.balance.currency)}
                    </p>
                    <p className="text-sm font-medium text-gray-500">{account.balance.currency}</p>
                </div>
            </div>
            <div className="mt-6 flex justify-between items-center text-xs text-gray-500">
                <span>{account.accountNumber}</span>
                <span><TimeAgo dateString={account.lastSync} /></span>
            </div>
        </div>
    );
};

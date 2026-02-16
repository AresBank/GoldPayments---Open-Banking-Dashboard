
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LinkAccountModal } from './components/LinkAccountModal';
import { Auth } from './components/Auth';
import type { Account, Transaction, User, BankFeed, ReconciliationLog } from './types';
import * as db from './db';

const App: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [bankFeeds, setBankFeeds] = useState<BankFeed[]>([]);
    const [reconciliationLogs, setReconciliationLogs] = useState<ReconciliationLog[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        db.initDB();
    }, []);

    const loadUserData = (loggedInUser: User) => {
        const { accounts: userAccounts, transactions: userTransactions } = db.getUserData(loggedInUser.id);
        const { bankFeeds: userBankFeeds, reconciliationLogs: userReconLogs } = db.getReconciliationData(loggedInUser.id);
        setUser(loggedInUser);
        setAccounts(userAccounts);
        setTransactions(userTransactions);
        setBankFeeds(userBankFeeds);
        setReconciliationLogs(userReconLogs);
        setIsAuthenticated(true);
    };

    const handleRegister = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        const newUser = db.createUser(name, email, password);
        if (newUser) {
            loadUserData(newUser);
            return { success: true };
        }
        return { success: false, message: 'El correo electrónico ya está registrado.' };
    };

    const handleLogin = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        const authenticatedUser = db.authenticateUser(email, password);
        if (authenticatedUser) {
            loadUserData(authenticatedUser);
            return { success: true };
        }
        return { success: false, message: 'Credenciales inválidas.' };
    };

    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setAccounts([]);
        setTransactions([]);
        setBankFeeds([]);
        setReconciliationLogs([]);
    };

    const addNewAccount = (institutionName: string) => {
        if (!user) return;
        
        db.createAccountForUser(user.id, institutionName);
        
        // Refresh data from DB
        loadUserData(user);
    };

    const handleMakeTransfer = (transferDetails: {
        sourceAccountId: string;
        amount: number;
        beneficiary: string;
        destinationClabe: string;
        concept: string;
        destinationBank: string;
    }): boolean => {
        if (!user) return false;
        
        const success = db.executeTransfer(transferDetails);
        if (success) {
            // Refresh data to reflect new balance and transaction
            setTimeout(() => loadUserData(user), 500);
        }
        return success;
    };


    const allTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions]);
    
    if (!isAuthenticated) {
        return <Auth onRegister={handleRegister} onLogin={handleLogin} />;
    }
    
    return (
        <div className="min-h-screen bg-[#0D0D0D]">
            <Header user={user} onLogout={handleLogout} />
            <main className="p-4 sm:p-6 lg:p-8">
                <Dashboard 
                    accounts={accounts} 
                    transactions={allTransactions}
                    bankFeeds={bankFeeds}
                    reconciliationLogs={reconciliationLogs}
                    onLinkAccount={() => setIsModalOpen(true)}
                    onMakeTransfer={handleMakeTransfer}
                />
            </main>
            {isModalOpen && (
                <LinkAccountModal 
                    onClose={() => setIsModalOpen(false)}
                    onAccountLinked={addNewAccount}
                />
            )}
        </div>
    );
};

export default App;
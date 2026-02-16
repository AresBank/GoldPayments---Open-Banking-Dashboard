
import type { User, Account, Transaction, BankFeed, ReconciliationLog } from './types';
import { MOCK_INSTITUTIONS } from './constants';

const DB_KEY = 'goldpayments_db';

interface Database {
    users: User[];
    accounts: Account[];
    transactions: Transaction[];
    bank_feeds: BankFeed[];
    reconciliation_logs: ReconciliationLog[];
}

// --- Helper Functions ---

const getDB = (): Database => {
    const dbString = localStorage.getItem(DB_KEY);
    return dbString ? JSON.parse(dbString) : { users: [], accounts: [], transactions: [], bank_feeds: [], reconciliation_logs: [] };
};

const saveDB = (db: Database) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const generateId = (prefix: string) => `${prefix}_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;

const calculateClabeControlDigit = (clabeWithoutControlDigit: string): number => {
    const weightingFactors = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
    let sum = 0;
    for (let i = 0; i < 17; i++) {
        sum += (parseInt(clabeWithoutControlDigit.charAt(i), 10) * weightingFactors[i]) % 10;
    }
    return (10 - (sum % 10)) % 10;
};

const generateValidClabe = (): string => {
    const bankCode = '646'; // STP (Sistema de Transferencias y Pagos) is a common choice for fintechs
    const cityCode = '100'; // A generic city code for online accounts
    
    // Generate an 11-digit random account number
    let accountNumber = '';
    for (let i = 0; i < 11; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }

    const clabeWithoutControlDigit = `${bankCode}${cityCode}${accountNumber}`;
    const controlDigit = calculateClabeControlDigit(clabeWithoutControlDigit);

    return `${clabeWithoutControlDigit}${controlDigit}`;
};


// --- DB Initialization ---

export const initDB = () => {
    if (!localStorage.getItem(DB_KEY)) {
        console.log("Initializing database...");
        saveDB({ users: [], accounts: [], transactions: [], bank_feeds: [], reconciliation_logs: [] });
    }
};


// --- User Management ---

export const createUser = (name: string, email: string, password: string): User | null => {
    const db = getDB();
    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return null; // User already exists
    }
    
    const newUser: User = { id: generateId('user'), name, email, password };
    db.users.push(newUser);

    // Create default GoldPayments account with bonus
    const goldPaymentsAccount: Account = {
        id: generateId('gp_acc'),
        provider: 'GoldPayments',
        institution: 'GoldPayments',
        accountName: 'Cuenta Principal',
        accountNumber: generateValidClabe(),
        status: 'active',
        lastSync: new Date().toISOString(),
        balance: {
            amount: 100000,
            currency: 'MXN',
        },
        userId: newUser.id,
    };
    db.accounts.push(goldPaymentsAccount);

    // Create bonus transaction
    const bonusTransaction: Transaction = {
        id: generateId('txn'),
        description: 'Bono de Registro',
        amount: 100000,
        currency: 'MXN',
        date: new Date().toISOString(),
        category: 'Ingresos',
        accountId: goldPaymentsAccount.id,
        institution: 'GoldPayments',
        status: 'Completada',
        beneficiary: 'GoldPayments',
        reconciliationStatus: 'RECONCILED',
    };
    db.transactions.push(bonusTransaction);

    // Create a matching bank feed for the bonus
    const bonusBankFeed: BankFeed = {
        id: generateId('bf'),
        description: 'DEPOSITO SPEI GOLD PAYMENTS',
        amount: 100000,
        currency: 'MXN',
        value_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        reconciliation_status: 'MATCHED',
        userId: newUser.id,
        institution: 'STP',
    };
    db.bank_feeds.push(bonusBankFeed);
    
    // Create a reconciliation log for the bonus
    const bonusReconLog: ReconciliationLog = {
        id: generateId('log'),
        internal_tx_id: bonusTransaction.id,
        bank_feed_id: bonusBankFeed.id,
        match_score: 100.00,
        match_method: 'AUTO',
        created_at: new Date().toISOString(),
    };
    db.reconciliation_logs.push(bonusReconLog);
    
    // Create some pending bank feeds
    const pendingFeeds: BankFeed[] = [
        { id: generateId('bf'), description: 'PAGO NETFLIX.COM', amount: -299, currency: 'MXN', value_date: new Date(Date.now() - 86400000).toISOString(), created_at: new Date().toISOString(), reconciliation_status: 'PENDING', userId: newUser.id, institution: 'BBVA'},
        // FIX: Changed 'REQUIRES_MANUAL_REVIEW' to 'MANUAL_REVIEW' to match the BankFeedStatus type.
        { id: generateId('bf'), description: 'RETIRO CAJERO 2345', amount: -1500, currency: 'MXN', value_date: new Date(Date.now() - 172800000).toISOString(), created_at: new Date().toISOString(), reconciliation_status: 'MANUAL_REVIEW', userId: newUser.id, institution: 'Santander'},
    ];
    db.bank_feeds.push(...pendingFeeds);

    saveDB(db);
    return newUser;
};

export const authenticateUser = (email: string, password: string): User | null => {
    const db = getDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    return user ? { id: user.id, name: user.name, email: user.email } : null;
};


// --- Data Retrieval ---

export const getUserData = (userId: string): { accounts: Account[], transactions: Transaction[] } => {
    const db = getDB();
    const userAccounts = db.accounts.filter(acc => acc.userId === userId);
    const userAccountIds = userAccounts.map(acc => acc.id);
    const userTransactions = db.transactions.filter(tx => userAccountIds.includes(tx.accountId));
    return { accounts: userAccounts, transactions: userTransactions };
};

export const getReconciliationData = (userId: string): { bankFeeds: BankFeed[], reconciliationLogs: ReconciliationLog[] } => {
    const db = getDB();
    const userBankFeeds = db.bank_feeds.filter(bf => bf.userId === userId);
    const userBankFeedIds = userBankFeeds.map(bf => bf.id);
    const userReconciliationLogs = db.reconciliation_logs.filter(log => userBankFeedIds.includes(log.bank_feed_id));
    return { bankFeeds: userBankFeeds, reconciliationLogs: userReconciliationLogs };
};


// --- Data Creation & Manipulation ---

export const createAccountForUser = (userId: string, institutionName: string) => {
    const db = getDB();
    const institution = MOCK_INSTITUTIONS.find(inst => inst.name === institutionName);
    if (!institution) return;

    const newAccount: Account = {
        id: generateId('gp_acc'),
        provider: 'Belvo',
        institution: institution.name,
        accountName: 'Cuenta de Ahorros',
        accountNumber: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'active',
        lastSync: new Date().toISOString(),
        balance: {
            amount: Math.floor(5000 + Math.random() * 45000),
            currency: 'MXN',
        },
        userId: userId,
    };
    db.accounts.push(newAccount);

    const newTransactions: Transaction[] = Array.from({ length: 5 }).map((_, i) => ({
        id: generateId('txn'),
        description: `Compra en ${['Amazon', 'MercadoLibre', 'Uber', 'Rappi'][Math.floor(Math.random() * 4)]}`,
        amount: -(Math.random() * 1000 + 50),
        currency: 'MXN',
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        category: ['Compras', 'Transporte', 'Comida'][Math.floor(Math.random() * 3)],
        accountId: newAccount.id,
        institution: newAccount.institution,
        status: 'Completada',
    }));

    db.transactions.push(...newTransactions);
    saveDB(db);
};

export const executeTransfer = (details: {
    sourceAccountId: string;
    amount: number;
    beneficiary: string;
    destinationClabe: string;
    concept: string;
    destinationBank: string;
}): boolean => {
    const db = getDB();
    const sourceAccountIndex = db.accounts.findIndex(acc => acc.id === details.sourceAccountId);

    if (sourceAccountIndex === -1) {
        console.error("Source account not found");
        return false;
    }

    const sourceAccount = db.accounts[sourceAccountIndex];
    if (sourceAccount.balance.amount < details.amount) {
        console.error("Insufficient funds");
        return false;
    }
    
    // Update balance
    sourceAccount.balance.amount -= details.amount;
    sourceAccount.lastSync = new Date().toISOString();
    db.accounts[sourceAccountIndex] = sourceAccount;

    // Create new transaction
    const newTransaction: Transaction = {
        id: generateId('txn'),
        accountId: sourceAccount.id,
        amount: -details.amount,
        beneficiary: details.beneficiary,
        category: 'Transferencias',
        currency: sourceAccount.balance.currency,
        date: new Date().toISOString(),
        description: details.concept,
        institution: sourceAccount.institution,
        status: 'Completada',
        reconciliationStatus: 'PENDING',
    };
    db.transactions.push(newTransaction);
    
    // Simulate a corresponding bank feed entry appearing later
    const newBankFeed: BankFeed = {
        id: generateId('bf'),
        description: `SPEI A ${details.beneficiary.toUpperCase()}`,
        amount: -details.amount,
        currency: 'MXN',
        value_date: new Date(Date.now() + 300000).toISOString(), // 5 mins later
        created_at: new Date().toISOString(),
        reconciliation_status: 'PENDING',
        userId: sourceAccount.userId,
        institution: sourceAccount.institution,
    };
    db.bank_feeds.push(newBankFeed);


    saveDB(db);
    return true;
};

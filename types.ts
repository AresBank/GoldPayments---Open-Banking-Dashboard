
// FIX: Import React to use React types.
import React from 'react';

export interface Balance {
  amount: number;
  currency: string;
}

export interface Account {
  id: string;
  provider: string;
  institution: string;
  accountName: string;
  accountNumber: string;
  status: 'active' | 'inactive' | 'syncing';
  lastSync: string;
  balance: Balance;
  userId: string;
}

export type ReconciliationStatus = 'PENDING' | 'RECONCILED' | 'MANUAL_REVIEW';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  accountId: string;
  institution: string;
  status: 'Completada' | 'Pendiente' | 'Fallida';
  beneficiary?: string;
  reconciliationStatus?: ReconciliationStatus;
}

export interface SpendingCategory {
  name: string;
  total: number;
}

export interface Institution {
  name: string;
  logo: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
}

export type BankFeedStatus = 'PENDING' | 'MATCHED' | 'MANUAL_REVIEW';

export interface BankFeed {
    id: string;
    description: string;
    amount: number;
    currency: string;
    value_date: string;
    created_at: string;
    reconciliation_status: BankFeedStatus;
    userId: string;
    institution: string;
}

export interface ReconciliationLog {
    id: string;
    internal_tx_id: string;
    bank_feed_id: string;
    match_score: number;
    match_method: 'AUTO' | 'MANUAL';
    created_at: string;
}
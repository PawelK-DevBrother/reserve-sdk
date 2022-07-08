export enum AccountTransactionType {
    debit,
    credit,
}

export enum AccountTransactionClass {
    trade,
    fee,
    payment,
    reward,
    conversion,
}

interface AccountTransaction {
    serial_id?: number;
    account_transaction_id: string;
    parent_transaction_id: string;
    client_transaction_id?: string;
    user_id: string;
    account_id: string;
    payment_id?: string;
    currency_id: string;
    transaction_class: AccountTransactionClass;
    type: AccountTransactionType;
    order_id?: string;
    trade_id?: string;
    conversion_id?: string;
    amount?: number;
    post_balance: number;
    comment?: string;
    created_at: string;
    created_at_iso: string;
}

export interface RecordTransactionItem {
    account_transaction_id?: string;
    user_id: string;
    currency_id: string;
    type: AccountTransactionType;
    transaction_class: AccountTransactionClass;
    amount: number;
    client_transaction_id?: string;
    comment?: string;
    trade_id?: string;
    order_id?: string;
    payment_id?: string;
    conversion_id?: string;
}

export interface CreateAccountTransactionResult {
    parent_transaction_id: string;
    account_transactions: AccountTransaction[];
}

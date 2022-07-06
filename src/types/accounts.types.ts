export interface AccountBalance {
    currency_id: string;
    total_balance: number;
    exposed_balance: number;
    free_balance: number;
    free_balance_quoted?: number;
}

export interface GetAccountBalanceArgs {
    user_id?: string;
    quote_currency_id?: string;
}

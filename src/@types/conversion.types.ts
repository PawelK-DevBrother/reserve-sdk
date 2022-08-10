import {PagerSortDateRange} from './users.types';
interface EstimateOrderFee {
    currency_id: string;
    amount: number;
}
enum ConversionStatus {
    new = 'new',
    completed = 'completed',
    rejected = 'rejected',
}

export interface CreateConversionQuoteArgs {
    user_id?: string;
    source_currency_id: string;
    target_currency_id: string;
    source_currency_amount?: number;
    target_currency_amount?: number;
}

export interface GetConversionArgs extends PagerSortDateRange {
    user_id?: string;
    search?: string;
    conversion_quote_id?: string;
    source_currency_id?: string;
    target_currency_id?: string;
}

export interface CreateConversionQuoteResult {
    conversion_quote_id: string;
    source_currency_id: string;
    source_currency_amount: number;
    target_currency_id: string;
    target_currency_amount: number;
    fee_currency_id: string;
    fee_currency_amount: number;
    instrument_id: string;
    price: number;
    expires_at: string;
    fees: EstimateOrderFee[];
    expires_at_iso: string;
}

export interface CreateConversionOrderArgs {
    conversion_quote_id: string;
    return_on_complete?: boolean;
    user_id?: string;
    reference?: string;
}

export interface Conversion {
    conversion_id: string;
    conversion_quote_id: string;
    reference?: string;
    source_currency_id: string;
    source_currency_amount: number;
    target_currency_id: string;
    target_currency_amount: number;
    fee_currency_id: string;
    fee_currency_amount: number;
    price: number;
    status: ConversionStatus;
    user_id: string;
    parent_transaction_id?: string;
    message?: string;
    error_message?: string;
    created_at: string;
    updated_at: string;
    created_at_iso: string;
    updated_at_iso: string;
}

import {CryptoAddressTagType} from './deposit.address.crypto.types';

export enum PaymentType {
    withdrawal = 'withdrawal',
    deposit = 'deposit',
}

export enum PaymentStatus {
    new = 'new',
    pending = 'pending',
    rejected = 'rejected',
    processing = 'processing',
    completed = 'completed',
    failed = 'failed',
}

export enum PaymentApprovalStatus {
    pending = 'pending',
    approved = 'approved',
    rejected = 'rejected',
}

export interface CreateFiatWithdrawalArgs {
    user_id?: string;
    amount: number;
    currency_id: string;
    fiat_bank_name: string;
    fiat_bank_bic: string;
    fiat_beneficiary_name: string;
    fiat_beneficiary_account_number: string;
    fiat_beneficiary_address_line_1?: string;
    fiat_beneficiary_address_line_2?: string;
    fiat_bank_address?: string;
    fiat_routing_number?: string;
    fiat_reference?: string;
    fiat_notes?: string;
}

export interface Payment {
    payment_id: string;
    user_id: string;
    currency_id: string;
    amount: number;
    type: PaymentType;
    psp_service_id: number;
    crypto_transaction_id?: string;
    crypto_address?: string;
    crypto_address_tag_type?: CryptoAddressTagType;
    crypto_address_tag_value?: string;
    crypto_network?: string;
    fiat_bank_name?: string;
    fiat_bank_address?: string;
    fiat_bank_bic?: string;
    fiat_routing_number?: string;
    fiat_reference?: string;
    fiat_notes?: string;
    fiat_beneficiary_name?: string;
    fiat_beneficiary_account_number?: string;
    fiat_beneficiary_address_line_1?: string;
    fiat_beneficiary_address_line_2?: string;
    status: PaymentStatus;
    approval_status: PaymentApprovalStatus;
    body_amount: number;
    fee_amount: number;
    record_account_transaction_id?: string;
    revert_account_transaction_id?: string;
    ip_address?: string;
    message?: string;
    error_message?: string;
    created_at: string;
    updated_at: string;
}

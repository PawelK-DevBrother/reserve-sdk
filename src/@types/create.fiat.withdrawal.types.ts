import {CryptoAddressTagType} from './deposit.address.crypto.types';
import {ToggleSwitch} from './users.types';

export enum PaymentType {
    withdrawal = 'withdrawal',
    deposit = 'deposit',
}

export enum PaymentStatus {
    new = 'new',
    processing = 'processing',
    rejected = 'rejected',
    completed = 'completed',
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

export enum CryptoNetworkFeePreference {
    low = 'low',
    medium = 'medium',
    high = 'high',
}

export interface Payment {
    payment_id: string;
    remote_txid: string;
    user_id: string;
    currency_id: string;
    amount: number;
    type: PaymentType;
    psp_service_id: string;
    psp_event_bridge_event_id: string;
    crypto_transaction_id?: string;
    crypto_address?: string;
    crypto_address_tag_type?: CryptoAddressTagType;
    crypto_address_tag_value?: string;
    crypto_network?: string;
    crypto_network_fee_preference: CryptoNetworkFeePreference;
    crypto_confirmations_received: number;
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
    approval_reason: string;
    approved_by: string;
    approved_at: string;
    body_amount: number;
    fee_amount: number;
    record_account_transaction_id: string;
    revert_account_transaction_id: string;
    ip_address: string;
    message: string;
    error_message: string;
    reference: string;
    created_at: string;
    fees_included: ToggleSwitch;
    updated_at: string;
    version: number;
    created_at_iso: string;
    updated_at_iso: string;
}

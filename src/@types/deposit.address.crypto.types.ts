export enum CryptoAddressTagType {
    destination_tag = 'destination_tag',
    memo_id = 'memo_id',
    note = 'note',
    tag = 'tag',
}

export interface DepositAddressCrypto {
    deposit_address_crypto_id: string;
    user_id: string;
    currency_id: string;
    address: string;
    address_tag_type?: CryptoAddressTagType;
    address_tag_value?: string;
    network?: string;
    psp_service_id?: string;
    created_at: string;
    updated_at: string;
}

export interface DepositAddressCryptoArgs {
    network: string;
    currency_id: string;
    user_id?: string;
}

export interface FavoriteAddressCrypto {
    currency_id: string;
    address?: string;
    address_tag_type?: CryptoAddressTagType;
    address_tag_value?: string;
    network?: string;
    name?: string;
}

export interface FavoriteAddressCryptoItem {
    currency_id: string;
    address?: string;
    address_tag_type?: CryptoAddressTagType;
    address_tag_value?: string;
    network?: string;
    name?: string;
}

export interface FavoriteFiatDestination {
    name: string;
    bank_name?: string;
    bank_address?: string;
    bank_bic?: string;
    routing_number?: string;
    reference?: string;
    notes?: string;
    beneficiary_name?: string;
    beneficiary_account_number?: string;
    beneficiary_address_line_1?: string;
    beneficiary_address_line_2?: string;
}

export interface FavoriteFiatDestinationItem {
    name: string;
    bank_name?: string;
    bank_address?: string;
    bank_bic?: string;
    routing_number?: string;
    reference?: string;
    notes?: string;
    beneficiary_name?: string;
    beneficiary_account_number?: string;
    beneficiary_address_line_1?: string;
    beneficiary_address_line_2?: string;
}

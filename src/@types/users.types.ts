import {FavoriteAddressCrypto, FavoriteAddressCryptoItem, FavoriteFiatDestination, FavoriteFiatDestinationItem} from './deposit.address.crypto.types';

export interface User {
    serial_id: number;
    user_id: string;
    parent_user_id: string;
    integer_tracking_id: number;
    username?: string;
    email?: string;
    language?: string;
    timezone?: string;
    primary_market_currency?: string;
    is_active: ToggleSwitch;
    first_name?: string;
    last_name?: string;
    address_country?: string;
    address_state?: string;
    address_city?: string;
    address_line_1?: string;
    address_line_2?: string;
    address_zip?: string;
    fee_group_id: string;
    limit_group_id: string;
    kyc_level?: string;
    kyc_status: UserKycStatus;
    kyc_message: string;
    created_at: string;
    mfa_for_withdraw: ToggleSwitch;
    updated_at: string;
    favorite_instruments?: string[];
    favorite_addresses_crypto: FavoriteAddressCrypto[];
    favorite_fiat_destinations: FavoriteFiatDestination[];
    profile_pic_url?: string;
    passport_url?: string;
    national_identity_url?: string;
    driver_license_url?: string;
    birth_certificate_url?: string;
    bank_statement_url?: string;
    mfa_status?: ToggleSwitch;
    utility_bill_url?: string;
    parent_user: User;
}

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface DateRangeInput {
    time_from?: string;
    time_to?: string;
}
interface PagerInput {
    limit?: number;
    offset?: number;
}
interface SortInput {
    direction: SortDirection;
}

export interface PagerSortDateRange {
    pager?: PagerInput;
    sort?: SortInput;
    dateRange?: DateRangeInput;
}

export interface GetUsersFilterArgs extends PagerSortDateRange {
    username?: string;
    email?: string;
    user_id?: string;
    pager?: PagerInput;
    sort?: SortInput;
}

export interface AdminUserIdArgs {
    user_id?: string;
}

export interface GetOneUserArgs extends AdminUserIdArgs {}

export enum ToggleSwitch {
    on = 'on',
    off = 'of',
}

export enum UserKycStatus {
    incomplete = 'incomplete',
    rejected = 'rejected',
    approved = 'approved',
    requires_action = 'requires_action',
    submitted = 'submitted',
}

export interface UpdateUserArgs extends AdminUserIdArgs {
    parent_user_id?: string;
    username?: string;
    email?: string;
    language?: string;
    timezone?: string;
    primary_market_currency?: string;
    is_active?: ToggleSwitch;
    first_name?: string;
    last_name?: string;
    address_country?: string;
    address_state?: string;
    address_city?: string;
    address_line_1?: string;
    address_line_2?: string;
    address_zip?: string;
    mfa_for_withdraw?: ToggleSwitch;
    updated_at?: string;
    favorite_instruments?: string[];
    favorite_addresses_crypto?: FavoriteAddressCryptoItem[];
    favorite_fiat_destinations?: FavoriteFiatDestinationItem[];
    mfa_token?: string;
}

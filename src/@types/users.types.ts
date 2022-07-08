export interface User {
    serial_id: number;
    user_id: string;
    username?: string;
    email?: string;
    language?: string;
    timezone?: string;
    primary_market_currency?: string;
    exchange?: string;
    is_active: number;
    first_name?: string;
    last_name?: string;
    address_country?: string;
    address_state?: string;
    address_city?: string;
    address_line_1?: string;
    address_line_2?: string;
    address_zip?: string;
    created_at: string;
    updated_at: string;
    favorite_instruments?: string[];
    profile_pic_url?: string;
    passport_url?: string;
    national_identity_url?: string;
    driver_license_url?: string;
    birth_certificate_url?: string;
    bank_statement_url?: string;
    utility_bill_url?: string;
}

export enum SortDirection {
    ASC,
    DESC,
}

export interface DateRangeInput {
    time_from?: String;
    time_to?: String;
}
interface PagerInput {
    limit?: number;
    offset?: number;
}
interface SortInput {
    direction: SortDirection;
}

export interface GetUsersFilterArgs {
    username?: string;
    email?: string;
    user_id?: string;
    pager?: PagerInput;
    sort?: SortInput;
    dateRange?: DateRangeInput;
}

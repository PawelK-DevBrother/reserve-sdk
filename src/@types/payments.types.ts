import {PaymentStatus, PaymentType} from './create.fiat.withdrawal.types';
import {PagerSort, PagerSortDateRange, ToggleSwitch} from './users.types';

export interface GetPaymentsHistoryArgs extends PagerSortDateRange {
    payment_id?: string;
    currency_id?: string;
    type?: PaymentType;
    user_id?: string;
    search?: string;
    status?: PaymentStatus[];
    payment_id_in?: string[];
    payment_id_not_in?: string[];
}

export interface PaymentRoute {
    payment_route_id: string;
    currency_id: string;
    psp_service_id: string;
    crypto_network?: string;
    crypto_address_tag_type?: string;
    is_active: ToggleSwitch;
}

export interface GetPaymentsRoutesArgs extends PagerSort {
    payment_route_id?: string;
    currency_id?: string;
    psp_service_id?: string;
    crypto_network?: string;
}

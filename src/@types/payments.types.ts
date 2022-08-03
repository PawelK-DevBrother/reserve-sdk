import {PaymentStatus, PaymentType} from './create.fiat.withdrawal.types';
import {PagerSortDateRange} from './users.types';

export interface GetPaymentsHistoryArgs extends PagerSortDateRange {
    payment_id?: string;
    currency_id?: string;
    type?: PaymentType;
    user_id?: string;
    search?: string;
    status?: PaymentStatus[];
}

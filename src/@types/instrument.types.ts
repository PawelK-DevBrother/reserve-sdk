import {DateRangeInput} from './users.types';

export enum CurrencyType {
    crypto = 'crypto',
    fiat = 'fiat',
}

export enum InstrumentHistoryPeriodicity {
    minute = 'minute',
    minute5 = 'minute5',
    minute15 = 'minute15',
    minute30 = 'minute30',
    hour = 'hour',
    hour4 = 'hour4',
    hour8 = 'hour8',
    day = 'day',
    week = 'week',
    month = 'month',
}

export interface Instrument {
    name: string;
    instrument_id: string;
    base_currency_id: string;
    quote_currency_id: string;
    price_decimals: number;
    min_quantity: number;
    max_quantity: number;
    min_quote_quantity: number;
    max_quote_quantity: number;
    price_bars: InstrumentPriceHistory[];
    recent_price_bar: InstrumentPriceHistory;
    base_currency: Currency;
    quote_currency: Currency;
    trading_fees: TradingFee;
    price: InstrumentPrice;
}

export interface InstrumentPriceHistory {
    instrument_id: string;
    high: number;
    low: number;
    open: number;
    close: number;
    volume_from: number;
    volume_to: number;
    price_24h_change?: number;
    ts: string;
    ts_iso: string;
}

export interface Currency {
    currency_id: string;
    type: CurrencyType;
    precision: number;
}

export interface TradingFee {
    instrument_id: string;
    fee_group_id: string;
    maker_progressive: number;
    taker_progressive: number;
    maker_flat: number;
    taker_flat: number;
}

export interface InstrumentPrice {
    instrument_id: string;
    ask?: number;
    bid?: number;
    price_24h_change?: number;
    ts: string;
    ts_iso: string;
}

export interface GetInstrumentsArgs {
    limit?: number;
    date_range?: DateRangeInput;
    periodicity?: InstrumentHistoryPeriodicity;
}

export interface GetInstrumentPriceBarsArgs extends GetInstrumentsArgs {
    instrument_id: string;
}

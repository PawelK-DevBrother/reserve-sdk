import {config} from './config';
import {CreateFiatWithdrawalArgs} from './@types/create.fiat.withdrawal.types';
// Tools
import {GraphQlCustomError} from './utils';
import {gql, GraphQLClient, Variables} from 'graphql-request';
// Types
import {HealthCheckResult} from './@types/utils.types';
import {DemoSigninArgs, SignInResult} from './@types/demo.signin.types';
import {DepositAddressCryptoArgs} from './@types/deposit.address.crypto.types';
import {User, SortDirection, GetUsersFilterArgs} from './@types/users.types';
import {AccountBalance, GetAccountBalanceArgs} from './@types/accounts.types';
import {RecordTransactionItem, CreateAccountTransactionResult} from './@types/transactions.types';
import {
    GetInstrumentsArgs,
    Instrument,
    GetInstrumentPriceBarsArgs,
    InstrumentPriceHistory,
} from './@types/instrument.types';
import {
    CreateConversionQuoteResult,
    CreateConversionQuoteArgs,
    CreateConversionOrderArgs,
    Conversion,
} from './@types/conversion.types';

export class Reserve_SDK {
    private gql_client: GraphQLClient;
    private auth_token: string;

    constructor(endpoint: string) {
        this.gql_client = new GraphQLClient(endpoint);
    }

    setAuthToken(token: string): void {
        this.auth_token = token;
    }
    private async gql_request(body: string, variables: Variables = undefined) {
        return this.gql_client.request(body, variables, {authorization: `Bearer ${this.auth_token}`}).catch((e) => {
            try {
                const error_body = {
                    msg: e.response.errors[0].message,
                    statusCode: e.response.status,
                    query: e.request.query,
                    variables: e.request.variables,
                };
                throw new GraphQlCustomError(error_body);
            } catch (error) {
                if (error instanceof GraphQlCustomError) throw error;
            }
            throw e;
        });
    }

    /**
     * * ### Usage
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * const res = await Sdk_Instance.healthcheck();
     * ```
     */
    async healthcheck(): Promise<HealthCheckResult> {
        const query = gql`
            query {
                healthcheck {
                    maintenance_mode
                    maintenance_message
                }
            }
        `;
        const {healthcheck} = await this.gql_request(query);
        return healthcheck;
    }
    /**
     * **ASYNC** `checkin` method allows **AUTHENTICATED** users to perform check-in request
     * * ### Usage
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("admin_or_trader_token");
     * const res = await Sdk_Instance.checkin();
     * ```
     */
    async checkin(): Promise<boolean> {
        const mutation = gql`
            mutation {
                checkin
            }
        `;
        const {checkin} = await this.gql_request(mutation);
        return checkin;
    }

    /**
     * **ASYNC** `trader_demo_signin` method allows to obtain demo **TRADER** authentication token for specified username
     * * ### Usage
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * const res = await Sdk_Instance.trader_demo_signin({username:"example_1_2_3"});
     * ```
     */
    async trader_demo_signin(args: DemoSigninArgs): Promise<SignInResult> {
        const mutation = gql`
            mutation ($username: String!) {
                trader_demo_signin(username: $username) {
                    jwt
                    expires_at
                }
            }
        `;

        const {trader_demo_signin} = await this.gql_request(mutation, args);
        return trader_demo_signin;
    }

    /**
     * **ASYNC** `admin_demo_signin` method allows to obtain demo **ADMIN** authentication token for specified username
     * * ### Usage
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * const res = await Sdk_Instance.admin_demo_signin({username:"example_1_2_3"});
     * ```
     */
    async admin_demo_signin(args: DemoSigninArgs): Promise<SignInResult> {
        const mutation = gql`
            mutation ($username: String!) {
                admin_demo_signin(username: $username) {
                    jwt
                    expires_at
                }
            }
        `;

        const {admin_demo_signin} = await this.gql_request(mutation, args);
        return admin_demo_signin;
    }

    /**
     * **ASYNC** `get_users` method allows ADMINS to get users that can be filtered by multiple parameters
     * * ### Usage
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("admin_token");
     * const users = await Sdk_Instance.get_users({username: 'y', pager: {limit: 3}});
     * ```
     */
    async get_users(args?: GetUsersFilterArgs): Promise<User[]> {
        const defaultArgs = {
            email: '',
            user_id: '',
            pager: {limit: 30, offset: 0},
            sort: {
                direction: SortDirection.DESC,
            },
            dateRange: {},
        };

        const query = gql`
            query (
                $username: String
                $email: String
                $pager: PagerInput
                $sort: SortInput
                $dateRange: DateRangeInput
            ) {
                users(username: $username, email: $email, pager: $pager, sort: $sort, dateRange: $dateRange) {
                    serial_id
                    user_id
                    username
                    email
                    language
                    timezone
                    primary_market_currency
                    exchange
                    is_active
                    first_name
                    last_name
                    address_country
                    address_state
                    address_city
                    address_line_1
                    address_line_2
                    address_zip
                    created_at
                    updated_at
                    favorite_instruments
                    profile_pic_url
                    passport_url
                    national_identity_url
                    driver_license_url
                    birth_certificate_url
                    bank_statement_url
                    utility_bill_url
                }
            }
        `;

        const {users} = await this.gql_request(query, {...defaultArgs, ...args});
        return users;
    }

    /**
     * **ASYNC** `get_account_balances` method allows **AUTHENTICATED** users to get account balance
     * * ### Usage
     *
     * **Trader** - no **args** are required
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("trader_token");
     * const accounts_balances_trader = await Sdk_Instance.get_account_balances();
     * ```
     *
     * **Admin** - user_id **arg** is required
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("admin_token")
     * const accounts_balances_admin = await Sdk_Instance.get_account_balances({user_id: '3e8a836f-9bf5-4915-8c0b-e628396740bf'});
     * ```
     */
    async get_account_balances(args?: GetAccountBalanceArgs): Promise<AccountBalance[]> {
        const defaultParameters = {quote_currency_id: ''};

        const query = gql`
            query ($user_id: String, $quote_currency_id: String!) {
                accounts_balances(user_id: $user_id) {
                    currency_id
                    total_balance
                    exposed_balance
                    free_balance
                    free_balance_quoted(quote_currency_id: $quote_currency_id)
                }
            }
        `;

        const {accounts_balances} = await this.gql_request(query, {...defaultParameters, ...args});
        return accounts_balances;
    }

    /**
     * **ASYNC** `create_conversion_quote` method allows **AUTHENTICATED** users to get estimated conversion_quote
     * * ### Usage
     *
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("admin_or_trader_token");
     * const conversion_quote = await Sdk_Instance.create_conversion_quote({source_currency_id: 'BTC', target_currency_id: 'USDT', source_currency_amount: 30});
     * ```
     */
    async create_conversion_quote(args: CreateConversionQuoteArgs): Promise<CreateConversionQuoteResult> {
        const mutation = gql`
            mutation (
                $user_id: String
                $source_currency_id: String!
                $target_currency_id: String!
                $source_currency_amount: Float!
                $target_currency_amount: Float
            ) {
                create_conversion_quote(
                    user_id: $user_id
                    source_currency_id: $source_currency_id
                    target_currency_id: $target_currency_id
                    source_currency_amount: $source_currency_amount
                    target_currency_amount: $target_currency_amount
                ) {
                    conversion_quote_id
                    source_currency_id
                    source_currency_amount
                    target_currency_id
                    target_currency_amount
                    fee_currency_id
                    fee_currency_amount
                    instrument_id
                    price
                    expires_at
                    fees: expires_at_iso
                }
            }
        `;

        const {create_conversion_quote} = await this.gql_request(mutation, args);
        return create_conversion_quote;
    }

    /**
     * **ASYNC** `create_conversion_order` method allows **AUTHENTICATED** users to execute estimated conversion_quote
     * * ### Usage
     *
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("admin_or_trader_token");
     * const res = await Sdk_Instance.create_conversion_order({conversion_quote_id: 'your_conversion_quote_id'});
     * ```
     */
    async create_conversion_order(args: CreateConversionOrderArgs): Promise<Conversion> {
        const defaultArgs = {return_on_complete: true};

        const mutation = gql`
            mutation (
                $user_id: String
                $reference: String
                $return_on_complete: Boolean!
                $conversion_quote_id: String!
            ) {
                create_conversion_order(
                    user_id: $user_id
                    reference: $reference
                    return_on_complete: $return_on_complete
                    conversion_quote_id: $conversion_quote_id
                ) {
                    conversion_id
                    conversion_quote_id
                    reference
                    source_currency_id
                    source_currency_amount
                    target_currency_id
                    target_currency_amount
                    fee_currency_id
                    fee_currency_amount
                    price
                    status
                    user_id
                    parent_transaction_id
                    message
                    error_message
                    created_at
                    updated_at
                    created_at_iso
                    updated_at_iso
                }
            }
        `;

        const {create_conversion_order} = await this.gql_request(mutation, {...defaultArgs, ...args});
        return create_conversion_order;
    }

    /**
     * **ASYNC** `create_account_transaction` method allows **ADMINS** to create new transactions
     * * ### Usage
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken('your_admin_token');
     * const res = await Sdk_Instance.create_account_transaction({
     *          items: [
     *               {
     *                  user_id: '3e8a836f-9bf5-4915-8c0b-e628396740bf',
     *                  currency_id: 'USDT',
     *                  amount: 150,
     *                  transaction_class: 'payment',
     *                  comment: 'Example 1 2 3',
     *                  type: 'credit',
     *              },
     *              {
     *                  user_id: '3e8a836f-9bf5-4915-8c0b-e628396740bf',
     *                  currency_id: 'USDT',
     *                  amount: 100,
     *                  transaction_class: 'reward',
     *                  comment: 'Example 1 2 3',
     *                  type: 'debit',
     *              },
     *           ],
     * });
     * ```
     */
    async create_account_transaction(args: {items: RecordTransactionItem[]}): Promise<CreateAccountTransactionResult> {
        const mutation = gql`
            mutation ($items: [RecordTransactionItem!]!) {
                create_account_transaction(items: $items) {
                    parent_transaction_id
                    account_transactions {
                        serial_id
                        account_transaction_id
                        parent_transaction_id
                        client_transaction_id
                        user_id
                        account_id
                        payment_id
                        currency_id
                        transaction_class
                        type
                        order_id
                        trade_id
                        conversion_id
                        amount
                        post_balance
                        comment
                        created_at
                        created_at_iso
                    }
                }
            }
        `;

        const {create_account_transaction} = await this.gql_request(mutation, args);
        return create_account_transaction;
    }

    /**
     * **ASYNC** `get_instruments` method allows to get detailed data about instruments
     * * ### Usage
     *
     * ```ts
     * import {Reserve_SDK, InstrumentHistoryPeriodicity} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * const res = await Sdk_Instance.get_instruments({
     *   periodicity: InstrumentHistoryPeriodicity['day'],
     *   limit: 3,
     *    data_range: {
     *       time_from: '2022-07-06 16:20:01',
     *       time_to: '2022-07-06 18:40:05',
     *    }
     * });
     * ```
     */
    async get_instruments(args?: GetInstrumentsArgs): Promise<Instrument[]> {
        const defaultArgs = {periodicity: 'day', limit: 1};

        const query = gql`
            query ($periodicity: InstrumentHistoryPeriodicity!, $limit: Int, $date_range: DateRangeInput) {
                instruments {
                    name
                    instrument_id
                    base_currency_id
                    quote_currency_id
                    price_decimals
                    min_quantity
                    max_quantity
                    min_quote_quantity
                    max_quote_quantity
                    price_bars(periodicity: $periodicity, limit: $limit, date_range: $date_range) {
                        instrument_id
                        high
                        low
                        open
                        close
                        volume_from
                        volume_to
                        ts
                        ts_iso
                    }
                    recent_price_bar(periodicity: $periodicity) {
                        instrument_id
                        high
                        low
                        open
                        close
                        volume_from
                        volume_to
                        ts
                        ts_iso
                    }
                    base_currency {
                        currency_id
                        type
                        precision
                    }
                    quote_currency {
                        currency_id
                        type
                        precision
                    }
                    trading_fees {
                        instrument_id
                        fee_group_id
                        maker_progressive
                        taker_progressive
                        maker_flat
                        taker_flat
                    }
                    price {
                        instrument_id
                        ask
                        bid
                        price_24h_change
                        ts
                        ts_iso
                    }
                }
            }
        `;
        const {instruments} = await this.gql_request(query, {...defaultArgs, ...args});

        return instruments;
    }

    //flag
    //price changes
    //functions for deposit/withdrawals

    /**
     * **ASYNC** `get_instrument_price_bars` method allows to get detailed price bars data about specified instrument
     * * ### Usage
     *
     *```ts
     * import {Reserve_SDK, InstrumentHistoryPeriodicity} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * const res = await Sdk_Instance.get_instrument_price_bars({
     *    instrument_id: 'BTCUSDT',
     *    periodicity: InstrumentHistoryPeriodicity.day,
     *    limit: 3,
     *    data_range: {
     *       time_from: '2022-07-06 16:20:01',
     *       time_to: '2022-07-06 18:40:05',
     *    }
     * });
     * ```
     */
    async get_instrument_price_bars(args: GetInstrumentPriceBarsArgs): Promise<InstrumentPriceHistory[]> {
        const defaultArgs = {periodicity: 'day', limit: 1000};

        const query = gql`
            query (
                $instrument_id: String!
                $periodicity: InstrumentHistoryPeriodicity!
                $limit: Int
                $date_range: DateRangeInput
            ) {
                instrument_price_bars(
                    instrument_id: $instrument_id
                    periodicity: $periodicity
                    limit: $limit
                    date_range: $date_range
                ) {
                    instrument_id
                    high
                    low
                    open
                    close
                    volume_from
                    volume_to
                    ts
                    ts_iso
                }
            }
        `;
        const {instrument_price_bars} = await this.gql_request(query, {...defaultArgs, ...args});

        return instrument_price_bars;
    }

    /**
     * **ASYNC** `deposit_address_crypto` method allows **AUTHENTICATED** users to create new deposits
     * * ### Usage
     *
     * **Trader** - no **args** are required
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("trader_token");
     * const res = await Sdk_Instance.deposit_address_crypto({network: 'example_network', currency_id: 'BTC'});
     * ```
     *
     * **Admin** - user_id **arg** is required
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("admin_token")
     * const res = await Sdk_Instance.deposit_address_crypto({
     *     currency_id: 'BTC',
     *     user_id: 'example_user_id',
     *     network: 'example_network',
     * });
     * ```
     */
    async deposit_address_crypto(args: DepositAddressCryptoArgs) {
        const query = gql`
            query ($user_id: String, $network: String!, $currency_id: String!) {
                deposit_address_crypto(user_id: $user_id, network: $network, currency_id: $currency_id) {
                    deposit_address_crypto_id
                    user_id
                    currency_id
                    address
                    address_tag_type
                    address_tag_value
                    network
                    psp_service_id
                    created_at
                    updated_at
                }
            }
        `;

        const {deposit_address_crypto} = await this.gql_request(query, args);
        return deposit_address_crypto;
    }

    async create_fiat_withdrawal(args: CreateFiatWithdrawalArgs) {
        const mutation = gql`
            mutation (
                $user_id: String
                $amount: Float!
                $currency_id: String!
                $fiat_bank_name: String!
                $fiat_bank_bic: String!
                $fiat_beneficiary_name: String!
                $fiat_beneficiary_account_number: String!
                $fiat_beneficiary_address_line_1: String
                $fiat_beneficiary_address_line_2: String
                $fiat_bank_address: String
                $fiat_routing_number: String
                $fiat_reference: String
                $fiat_notes: String
            ) {
                create_withdrawal_fiat(
                    user_id: $user_id
                    amount: $amount
                    currency_id: $currency_id
                    fiat_bank_name: $fiat_bank_name
                    fiat_bank_bic: $fiat_bank_bic
                    fiat_beneficiary_name: $fiat_beneficiary_name
                    fiat_beneficiary_account_number: $fiat_beneficiary_account_number
                    fiat_beneficiary_address_line_1: $fiat_beneficiary_address_line_1
                    fiat_beneficiary_address_line_2: $fiat_beneficiary_address_line_2
                    fiat_bank_address: $fiat_bank_address
                    fiat_routing_number: $fiat_routing_number
                    fiat_reference: $fiat_reference
                    fiat_notes: $fiat_notes
                ) {
                    amount
                }
            }
        `;
        const res = await this.gql_request(mutation, args);
        return res;
    }
}

export * from './config';
export * from './utils';
export * from './@types/users.types';
export * from './@types/utils.types';
export * from './@types/accounts.types';
export * from './@types/instrument.types';
export * from './@types/conversion.types';
export * from './@types/demo.signin.types';
export * from './@types/transactions.types';

const main = async () => {
    const Sdk_Instance = new Reserve_SDK(config.graphQL.endpoint);

    Sdk_Instance.setAuthToken(config.auth.trader_token);
    Sdk_Instance.setAuthToken(config.auth.admin_token);

    const res = await Sdk_Instance.create_fiat_withdrawal({
        // user_id: 'example_user_id',
        amount: 0.5,
        currency_id: 'USD',
        fiat_bank_bic: 'example_fiat_bank_bic',
        fiat_bank_name: 'example_fiat_bank_name',
        fiat_beneficiary_name: 'example_fiat_beneficiary_name',
        fiat_beneficiary_account_number: 'example_fiat_beneficiary_account_number',
    });
    console.log(res);
};

main();

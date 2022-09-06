import {GetPaymentsHistoryArgs} from './@types/payments.types';
import {CreateFiatWithdrawalArgs, Payment} from './@types/create.fiat.withdrawal.types';
// Tools
import {GraphQlCustomError} from './utils';
import {gql, GraphQLClient, Variables} from 'graphql-request';
// Types
import {HealthCheckResult} from './@types/utils.types';
import {DemoSigninArgs, SignInResult} from './@types/demo.signin.types';
import {DepositAddressCrypto, DepositAddressCryptoArgs, FavoriteAddressCrypto} from './@types/deposit.address.crypto.types';
import {User, SortDirection, GetUsersFilterArgs, GetOneUserArgs, UpdateUserArgs} from './@types/users.types';
import {AccountBalance, GetAccountBalanceArgs} from './@types/accounts.types';
import {RecordTransactionItem, CreateAccountTransactionResult} from './@types/transactions.types';
import {GetInstrumentsArgs, Instrument, GetInstrumentPriceBarsArgs, InstrumentPriceHistory} from './@types/instrument.types';
import {CreateConversionQuoteResult, CreateConversionQuoteArgs, CreateConversionOrderArgs, Conversion, GetConversionArgs} from './@types/conversion.types';

export class Reserve_SDK {
    private gql_client: GraphQLClient;
    private headers: {[x: string]: string} = {};

    constructor(endpoint: string) {
        this.gql_client = new GraphQLClient(endpoint);
    }

    setAuthToken(token: string): void {
        this.headers['authorization'] = `Bearer ${token}`;
    }
    setXReserveAuth(value: any): void {
        this.headers['x-reserve-auth'] = value;
    }
    setCustomHeader(header_name: string, value: any): void {
        this.headers[header_name] = value;
    }
    getHeaders() {
        return this.headers;
    }

    private async gql_request(body: string, variables: Variables = undefined) {
        return this.gql_client.request(body, variables, this.headers).catch((e) => {
            try {
                console.log(e);
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
     *
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
     *
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
     *
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
     *
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
            query ($username: String, $email: String, $pager: PagerInput, $sort: SortInput, $dateRange: DateRangeInput) {
                users(username: $username, email: $email, pager: $pager, sort: $sort, dateRange: $dateRange) {
                    serial_id
                    user_id
                    parent_user_id
                    username
                    email
                    language
                    timezone
                    primary_market_currency
                    is_active
                    first_name
                    last_name
                    address_country
                    address_state
                    address_city
                    address_line_1
                    address_line_2
                    address_zip
                    fee_group_id
                    limit_group_id
                    kyc_level
                    kyc_status
                    kyc_message
                    created_at
                    mfa_for_withdraw
                    updated_at
                    favorite_instruments
                    favorite_addresses_crypto {
                        currency_id
                        address
                        address_tag_type
                        address_tag_value
                        network
                        name
                    }
                    favorite_fiat_destinations {
                        name
                        bank_name
                        bank_address
                        bank_bic
                        routing_number
                        reference
                        notes
                        beneficiary_name
                        beneficiary_account_number
                        beneficiary_address_line_1
                        beneficiary_address_line_2
                    }
                    profile_pic_url
                    passport_url
                    national_identity_url
                    driver_license_url
                    birth_certificate_url
                    bank_statement_url
                    mfa_status
                    utility_bill_url
                    parent_user {
                        user_id
                    }
                }
            }
        `;

        const {users} = await this.gql_request(query, {...defaultArgs, ...args});
        return users;
    }

    /**
     * **ASYNC** `get_user_info` method allows USERS to get info about themselfs and allows ADMIN to get info about specified user (user_id arg)
     * * ### Usage
     *
     * **Trader**
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("trader_token");
     * const user = await Sdk_Instance.get_user_info()
     * ```
     *
     * **Admin** - user_id **arg** available
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("admin_token")
     * const user = await Sdk_Instance.get_user_info({user_id:"your_user_id"})
     * ```
     */
    async get_user_info(args?: GetOneUserArgs): Promise<User> {
        const query = gql`
            query ($user_id: String) {
                user(user_id: $user_id) {
                    serial_id
                    user_id
                    parent_user_id
                    username
                    email
                    language
                    timezone
                    primary_market_currency
                    is_active
                    first_name
                    last_name
                    address_country
                    address_state
                    address_city
                    address_line_1
                    address_line_2
                    address_zip
                    fee_group_id
                    limit_group_id
                    kyc_level
                    kyc_status
                    kyc_message
                    created_at
                    mfa_for_withdraw
                    updated_at
                    favorite_instruments
                    favorite_addresses_crypto {
                        currency_id
                        address
                        address_tag_type
                        address_tag_value
                        network
                        name
                    }
                    favorite_fiat_destinations {
                        name
                        bank_name
                        bank_address
                        bank_bic
                        routing_number
                        reference
                        notes
                        beneficiary_name
                        beneficiary_account_number
                        beneficiary_address_line_1
                        beneficiary_address_line_2
                    }
                    profile_pic_url
                    passport_url
                    national_identity_url
                    driver_license_url
                    birth_certificate_url
                    bank_statement_url
                    mfa_status
                    utility_bill_url
                    parent_user {
                        user_id
                    }
                }
            }
        `;

        const {user} = await this.gql_request(query, args);
        return user;
    }

    async get_user_favorite_addresses(args?: GetOneUserArgs): Promise<FavoriteAddressCrypto[]> {
        const user = await this.get_user_info(args);
        return user.favorite_addresses_crypto;
    }

    /**
     * **ASYNC** `update_user` method allows USERS to update their details and allows ADMIN to update specified user (user_id arg)
     * * ### Usage
     *
     * **Trader**
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("trader_token");
     * const user = await Sdk_Instance.update_user({first_name:"test_first_name"})
     * ```
     *
     * **Admin** - user_id **arg** available
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("admin_token")
     * const user = await Sdk_Instance.get_user_info({user_id:"your_user_id",first_name:"test_first_name"})
     * ```
     */
    async update_user(args: UpdateUserArgs): Promise<User> {
        const mutation = gql`
            mutation (
                $user_id: String
                $parent_user_id: String
                $username: String
                $email: String
                $language: String
                $timezone: String
                $primary_market_currency: String
                $first_name: String
                $last_name: String
                $address_country: String
                $address_state: String
                $address_city: String
                $address_line_1: String
                $address_line_2: String
                $address_zip: String
                $updated_at: String
                $favorite_instruments: [String!]
                $mfa_token: String
                $is_active: ToggleSwitch
                $mfa_for_withdraw: ToggleSwitch
                $favorite_addresses_crypto: [FavoriteAddressCryptoItem!]
                $favorite_fiat_destinations: [FavoriteFiatDestinationItem!]
            ) {
                update_user(
                    user_id: $user_id
                    parent_user_id: $parent_user_id
                    username: $username
                    email: $email
                    language: $language
                    timezone: $timezone
                    primary_market_currency: $primary_market_currency
                    first_name: $first_name
                    last_name: $last_name
                    address_country: $address_country
                    address_state: $address_state
                    address_city: $address_city
                    address_line_1: $address_line_1
                    address_line_2: $address_line_2
                    address_zip: $address_zip
                    updated_at: $updated_at
                    favorite_instruments: $favorite_instruments
                    mfa_token: $mfa_token
                    is_active: $is_active
                    mfa_for_withdraw: $mfa_for_withdraw
                    favorite_addresses_crypto: $favorite_addresses_crypto
                    favorite_fiat_destinations: $favorite_fiat_destinations
                ) {
                    serial_id
                    user_id
                    parent_user_id
                    username
                    email
                    language
                    timezone
                    primary_market_currency
                    is_active
                    first_name
                    last_name
                    address_country
                    address_state
                    address_city
                    address_line_1
                    address_line_2
                    address_zip
                    fee_group_id
                    limit_group_id
                    kyc_level
                    kyc_status
                    kyc_message
                    created_at
                    mfa_for_withdraw
                    updated_at
                    favorite_instruments
                    favorite_addresses_crypto {
                        currency_id
                        address
                        address_tag_type
                        address_tag_value
                        network
                        name
                    }
                    favorite_fiat_destinations {
                        name
                        bank_name
                        bank_address
                        bank_bic
                        routing_number
                        reference
                        notes
                        beneficiary_name
                        beneficiary_account_number
                        beneficiary_address_line_1
                        beneficiary_address_line_2
                    }
                    profile_pic_url
                    passport_url
                    national_identity_url
                    driver_license_url
                    birth_certificate_url
                    bank_statement_url
                    mfa_status
                    utility_bill_url
                    parent_user {
                        user_id
                    }
                }
            }
        `;

        const {user} = await this.gql_request(mutation, args);
        return user;
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
            mutation ($user_id: String, $source_currency_id: String!, $target_currency_id: String!, $source_currency_amount: Float, $target_currency_amount: Float) {
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
            mutation ($user_id: String, $reference: String, $return_on_complete: Boolean!, $conversion_quote_id: String!) {
                create_conversion_order(user_id: $user_id, reference: $reference, return_on_complete: $return_on_complete, conversion_quote_id: $conversion_quote_id) {
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
     *
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
     *    date_range: {
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
                        price_24h_change
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
                        price_24h_change
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
     *    date_range: {
     *       time_from: '2022-07-06 16:20:01',
     *       time_to: '2022-07-06 18:40:05',
     *    }
     * });
     * ```
     */
    async get_instrument_price_bars(args: GetInstrumentPriceBarsArgs): Promise<InstrumentPriceHistory[]> {
        const defaultArgs = {periodicity: 'day', limit: 1000};

        const query = gql`
            query ($instrument_id: String!, $periodicity: InstrumentHistoryPeriodicity!, $limit: Int, $date_range: DateRangeInput) {
                instrument_price_bars(instrument_id: $instrument_id, periodicity: $periodicity, limit: $limit, date_range: $date_range) {
                    instrument_id
                    high
                    low
                    open
                    close
                    volume_from
                    volume_to
                    price_24h_change
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
     * **Trader**
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
    async deposit_address_crypto(args: DepositAddressCryptoArgs): Promise<DepositAddressCrypto> {
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

    /**
     * **ASYNC** `create_withdrawal_fiat` method allows **AUTHENTICATED** users to create fiat withdrawals
     * * ### Usage
     *
     * **Trader**
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("trader_token");
     * const res = await Sdk_Instance.create_withdrawal_fiat({
     *      amount: 0.5,
     *      currency_id: 'USD',
     *      fiat_bank_bic: 'example_fiat_bank_bic',
     *      fiat_bank_name: 'example_fiat_bank_name',
     *      fiat_beneficiary_name: 'example_fiat_beneficiary_name',
     *      fiat_beneficiary_account_number: 'example_fiat_beneficiary_account_number',
     * });
     * ```
     *
     * **Admin** - user_id **arg** is required
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("admin_token")
     * const res = await Sdk_Instance.create_withdrawal_fiat({
     *      user_id: 'example_user_id',
     *      amount: 0.5,
     *      currency_id: 'USD',
     *      fiat_bank_bic: 'example_fiat_bank_bic',
     *      fiat_bank_name: 'example_fiat_bank_name',
     *      fiat_beneficiary_name: 'example_fiat_beneficiary_name',
     *      fiat_beneficiary_account_number: 'example_fiat_beneficiary_account_number',
     * });
     * ```
     */
    async create_withdrawal_fiat(args: CreateFiatWithdrawalArgs): Promise<Payment> {
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
                    payment_id
                    user_id
                    currency_id
                    amount
                    type
                    crypto_transaction_id
                    crypto_address
                    crypto_address_tag_type
                    crypto_address_tag_value
                    crypto_network
                    fiat_bank_name
                    fiat_bank_address
                    fiat_bank_bic
                    fiat_routing_number
                    fiat_reference
                    fiat_notes
                    fiat_beneficiary_name
                    fiat_beneficiary_account_number
                    fiat_beneficiary_address_line_1
                    fiat_beneficiary_address_line_2
                    status
                    approval_status
                    record_account_transaction_id
                    revert_account_transaction_id
                    ip_address
                    message
                    error_message
                    created_at
                    updated_at
                    psp_service_id
                    body_amount
                    fee_amount
                }
            }
        `;
        const {create_withdrawal_fiat} = await this.gql_request(mutation, args);
        return create_withdrawal_fiat;
    }

    /**
     * **ASYNC** `get_conversions` method allows **AUTHENTICATED** users to get conversions history
     * * ### Usage
     *
     * **Trader**
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("trader_token");
     * const res = await Sdk_Instance.get_conversions({
     *    source_currency_id: 'BTC',
     *    target_currency_id: 'ETH',
     *    pager: {limit:3,offset:1},
     *    dateRange: {
     *       time_from: '2022-07-28 16:20:01',
     *       time_to: '2022-08-02 18:40:05',
     *    }
     * });
     * ```
     *
     * **Admin**
     * ```ts
     * import {Reserve_SDK} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("admin_token")
     * const res = await Sdk_Instance.get_conversions({
     *    user_id:'example_user_id',
     *    source_currency_id: 'BTC',
     *    target_currency_id: 'ETH',
     *    pager: {limit:3,offset:1},
     *    dateRange: {
     *       time_from: '2022-07-28 16:20:01',
     *       time_to: '2022-08-02 18:40:05',
     *    }
     * });
     * ```
     */
    async get_conversions(args?: GetConversionArgs): Promise<Conversion[]> {
        const query = gql`
            query (
                $user_id: String
                $search: String
                $conversion_quote_id: String
                $source_currency_id: String
                $target_currency_id: String
                $pager: PagerInput
                $sort: SortInput
                $dateRange: DateRangeInput
            ) {
                conversions(
                    user_id: $user_id
                    search: $search
                    conversion_quote_id: $conversion_quote_id
                    source_currency_id: $source_currency_id
                    target_currency_id: $target_currency_id
                    pager: $pager
                    sort: $sort
                    dateRange: $dateRange
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

        const {conversions} = await this.gql_request(query, args);
        return conversions;
    }

    /**
     * **ASYNC** `get_payments` method allows **AUTHENTICATED** users to get payments history
     * * ### Usage
     *
     * **Trader**
     * ```ts
     * import {Reserve_SDK,PaymentType,PaymentStatus} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("trader_token");
     * const res = await Sdk_Instance.get_payments({
     *    currency_id: 'ETH',
     *    type: PaymentType.deposit,
     *    status: [PaymentStatus.completed, PaymentStatus.rejected],
     *    pager: {limit:3,offset:1},
     *    dateRange: {
     *       time_from: '2022-07-28 16:20:01',
     *       time_to: '2022-08-02 18:40:05',
     *    }
     * });
     * ```
     *
     * **Admin**
     * ```ts
     * import {Reserve_SDK,PaymentType,PaymentStatus} from 'reserve-sdk';
     *
     * const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
     * Sdk_Instance.setAuthToken("admin_token");
     * const res = await Sdk_Instance.get_payments({
     *    user_id: 'example_user_id',
     *    currency_id: 'ETH',
     *    type: PaymentType.deposit,
     *    status: [PaymentStatus.completed, PaymentStatus.rejected],
     *    pager: {limit:3,offset:1},
     *    dateRange: {
     *       time_from: '2022-07-28 16:20:01',
     *       time_to: '2022-08-02 18:40:05',
     *    }
     * });
     * ```
     */
    async get_payments(args?: GetPaymentsHistoryArgs): Promise<Payment[]> {
        const query = gql`
            query ($payment_id: String, $currency_id: String, $type: PaymentType, $user_id: String, $search: String, $status: [PaymentStatus!]) {
                payments(payment_id: $payment_id, currency_id: $currency_id, type: $type, user_id: $user_id, search: $search, status: $status) {
                    payment_id
                    user_id
                    currency_id
                    amount
                    type
                    crypto_transaction_id
                    crypto_address
                    crypto_address_tag_type
                    crypto_address_tag_value
                    crypto_network
                    fiat_bank_name
                    fiat_bank_address
                    fiat_bank_bic
                    fiat_routing_number
                    fiat_reference
                    fiat_notes
                    fiat_beneficiary_name
                    fiat_beneficiary_account_number
                    fiat_beneficiary_address_line_1
                    fiat_beneficiary_address_line_2
                    status
                    approval_status
                    record_account_transaction_id
                    revert_account_transaction_id
                    ip_address
                    message
                    error_message
                    created_at
                    updated_at
                    psp_service_id
                    body_amount
                    fee_amount
                }
            }
        `;

        const {payments} = await this.gql_request(query, args);
        return payments;
    }
}

export * from './utils';
export * from './@types/users.types';
export * from './@types/utils.types';
export * from './@types/accounts.types';
export * from './@types/instrument.types';
export * from './@types/conversion.types';
export * from './@types/demo.signin.types';
export * from './@types/transactions.types';
export * from './@types/deposit.address.crypto.types';
export * from './@types/create.fiat.withdrawal.types';
export * from './@types/payments.types';

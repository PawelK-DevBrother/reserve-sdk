// Tools
import {GraphQlCustomError} from './utils';
import {gql, GraphQLClient, Variables} from 'graphql-request';
// Types
import {HealthcheckResult} from './@types/utils.types';
import {DemoSigninArgs, SignInResult} from './@types/demo.signin.types';
import {AccountBalance, GetAccountBalanceArgs} from './@types/accounts.types';
import {User, SortDirection, GetUsersFilterArgs} from './@types/users.types';
import {RecordTransactionItem, CreateAccountTransactionResult} from './@types/transactions.types';
import {
    CreateConversionQuoteResult,
    CreateConverstionQuoteArgs as CreateConversionQuoteArgs,
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
            throw new GraphQlCustomError(
                e.response.errors[0].message,
                e.response.status,
                e.request.query,
                e.request.variables,
            );
        });
    }

    async healthCheck(): Promise<HealthcheckResult> {
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
     * **ASYNC** `checkin` method allows **AUTHENTICATED** users to perform a GraphQL request in order to checkin
     * * ### Usage
     * ```ts
     * const Sdk_Instance = new Sdk();
     * Sdk_Instance.setAuthToken("admin_or_trader_token");
     * const result = await Sdk_Instance.checkin();
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
     * const Sdk_Instance = new Sdk();
     * const signin_result = await Sdk_Instance.trader_demo_signin({username:"example_1_2_3"});
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
     * const Sdk_Instance = new Sdk();
     * const signin_result = await Sdk_Instance.admin_demo_signin({username:"example_1_2_3"});
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
     * **ASYNC** `get_users` method allows ADMINS to perform a GraphQL request in order to get users that can be filtered by multiple parameters
     * * ### Usage
     * ```ts
     * const Sdk_Instance = new Sdk();
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
                direction: SortDirection[SortDirection.DESC],
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
     * **ASYNC** `get_account_balances` method allows **AUTHENTICATED** users to perform a GraphQL request in order to get account/'s balance
     * * ### Usage
     *
     * *Trader* - no **args** are required
     * ```ts
     * const Sdk_Instance = new Sdk();
     * Sdk_Instance.setAuthToken("trader_token");
     * const accounts_balances_trader = await Sdk_Instance.get_account_balances();
     * ```
     *
     * *Admin* - user_id **arg** is required
     * ```ts
     * const Sdk_Instance = new Sdk();
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
     * **ASYNC** `create_conversion_quote` method allows **AUTHENTICATED** users to perform a GraphQL request in order to get estimated conversion_quote
     * * ### Usage
     *
     * ```ts
     * const Sdk_Instance = new Sdk();
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
     * **ASYNC** `create_conversion_order` method allows **AUTHENTICATED** users to perform a GraphQL request in order to execute estimated conversion_quote
     * * ### Usage
     *
     * ```ts
     * const Sdk_Instance = new Sdk();
     * Sdk_Instance.setAuthToken("admin_or_trader_token");
     * const result = await Sdk_Instance.create_conversion_order({conversion_quote_id: 'your_conversion_quote_id'});
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
     * **ASYNC** `create_account_transaction` method allows **ADMINS** to perform a GraphQL request in order to create new transactions
     * * ### Usage
     * ```ts
     * const Sdk_Instance = new Sdk();
     * Sdk_Instance.setAuthToken('your_admin_token');
     * const result = await Sdk_Instance.create_account_transaction({
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
}

export * from './config';
export * from './utils';
export * from './@types/users.types';
export * from './@types/utils.types';
export * from './@types/accounts.types';
export * from './@types/conversion.types';
export * from './@types/demo.signin.types';
export * from './@types/transactions.types';

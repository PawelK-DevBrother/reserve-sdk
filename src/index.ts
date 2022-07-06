// Tools
import {gql_client} from './graphQLClient';
import {GraphQlCustomError} from './utils';
import {gql, Variables} from 'graphql-request';
// Types
import {FieldsFormat, HealthcheckResult} from './types/utils.types';
import {AccountBalance, GetAccountBalanceArgs} from './types/accounts.types';
import {User, SortDirection, GetUsersFilterArgs} from './types/users.types';
import {RecordTransactionItem, CreateAccountTransactionResult, AccountTransactionClass, AccountTransactionType} from './types/transactions.types';
import {
    CreateConversionQuoteResult,
    CreateConverstionQuoteArgs as CreateConversionQuoteArgs,
    CreateConversionOrderArgs,
    Conversion,
} from './types/conversion.types';

class Sdk {
    private auth_token: string;

    setAuthToken(token: string): void {
        this.auth_token = token;
    }
    private async gql_request(body: string, variables: Variables = undefined) {
        const res = gql_client.request(body, variables, {authorization: `Bearer ${this.auth_token}`}).catch((e) => {
            throw new GraphQlCustomError(e.response.errors[0].message, e.response.status, e.request.query, e.request.variables);
        });
        return res;
    }

    private joinFields(fields: FieldsFormat) {
        return fields.join(' ');
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
     * **ASYNC** `get_users` method allows ADMINS to perform a GraphQL request in order to get users that can be filtered by multiple parameters
     * * ### Usage
     * ```ts
     * const Sdk_Instance = new Sdk();
     * Sdk_Instance.setAuthToken("admin_token");
     * const users = await Sdk_Instance.get_users({args: {username: 'y', pager: {limit: 3}}, fields: ['user_id', 'username']});
     * ```
     */
    async get_users({args, fields}: {args?: GetUsersFilterArgs; fields: FieldsFormat}): Promise<User[]> {
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
            query ($username: String, $email: String, $pager: PagerInput, $sort: SortInput, $dateRange: DateRangeInput) {
                users(username: $username, email: $email, pager: $pager, sort: $sort, dateRange: $dateRange) {
                    ${this.joinFields(fields)}
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
     * const accounts_balances_trader = await Sdk_Instance.get_account_balances({fields: ['currency_id']});
     * ```
     *
     * *Admin* - user_id **arg** is required
     * ```ts
     * const Sdk_Instance = new Sdk();
     * Sdk_Instance.setAuthToken("admin_token")
     * const accounts_balances_admin = await Sdk_Instance.get_account_balances({
     *      args: {user_id: '3e8a836f-9bf5-4915-8c0b-e628396740bf'},
     *      fields: ['currency_id'],
     * });
     * ```
     */
    async get_account_balances({args, fields}: {args?: GetAccountBalanceArgs; fields: FieldsFormat}): Promise<AccountBalance[]> {
        const defaultParameters = {quote_currency_id: ''};

        const query = gql`
            query ($user_id: String) {
                accounts_balances(user_id: $user_id) {
                    ${this.joinFields(fields)}
                }
            }
            `;

        const merged_parameters = fields.includes('quote_currency_id') ? {...defaultParameters, ...args} : args;

        const {accounts_balances} = await this.gql_request(query, merged_parameters);
        return accounts_balances;
    }

    /**
     * **ASYNC** `create_conversion_quote` method allows **AUTHENTICATED** users to perform a GraphQL request in order to get estimated conversion_quote
     * * ### Usage
     *
     * ```ts
     * const Sdk_Instance = new Sdk();
     * Sdk_Instance.setAuthToken("admin_or_trader_token");
     * const conversion_quote = await Sdk_Instance.create_conversion_quote({
     *      args: {source_currency_id: 'BTC', target_currency_id: 'USDT', source_currency_amount: 30},
     *      fields: ['conversion_quote_id', 'price', 'expires_at'],
     * });
     * ```
     */
    async create_conversion_quote({args, fields}: {args: CreateConversionQuoteArgs; fields: FieldsFormat}): Promise<CreateConversionQuoteResult> {
        const mutation = gql`
        mutation($user_id: String, $source_currency_id: String!, $target_currency_id: String!, $source_currency_amount: Float!, $target_currency_amount: Float){
            create_conversion_quote(user_id: $user_id, source_currency_id: $source_currency_id, target_currency_id: $target_currency_id, source_currency_amount: $source_currency_amount, target_currency_amount: $target_currency_amount){
                ${this.joinFields(fields)}
            }
        }`;

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
     * const result = await Sdk_Instance.create_conversion_order({
     *      args: {conversion_quote_id: 'your_conversion_quote_id'},
     *      fields: ['status', 'error_message', 'message', 'price', 'fee_currency_amount'],
     * });
     * ```
     */
    async create_conversion_order({args, fields}: {args: CreateConversionOrderArgs; fields: FieldsFormat}): Promise<Conversion> {
        const defaultArgs = {return_on_complete: true};

        const mutation = gql`mutation($conversion_quote_id: String!, $return_on_complete: Boolean!, $user_id: String, $reference: String){
            create_conversion_order(conversion_quote_id: $conversion_quote_id, return_on_complete: $return_on_complete, user_id: $user_id, reference: $reference){
                ${this.joinFields(fields)}
            }
        }`;

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
     *      args: {
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
     *      },
     *      fields: ['parent_transaction_id'],
     * });
     * ```
     */
    async create_account_transaction({
        args,
        fields,
    }: {
        args: {items: RecordTransactionItem[]};
        fields: FieldsFormat;
    }): Promise<CreateAccountTransactionResult> {
        const mutation = gql`mutation($items: [RecordTransactionItem!]!){
            create_account_transaction(items: $items){
                ${this.joinFields(fields)}
            }
        }`;

        const {create_account_transaction} = await this.gql_request(mutation, {...args});
        return create_account_transaction;
    }
}

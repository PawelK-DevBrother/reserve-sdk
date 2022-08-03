## Reserve SDK

---

## Installation

```npm
npm i reserve-sdk
```

## Usage


### Custom headers

```ts
Sdk_Instance.setAuthToken('auth_token')

Sdk_Instance.setXReserveAuth('x_reserve_auth_value');

console.log(Sdk_Instance.getHeaders());

Sdk_Instance.setCustomHeader('x-reserve-auth', 'value');

Sdk_Instance.setCustomHeader('custom_header', 'custom_value');

console.log(Sdk_Instance.getHeaders());
```

<!-- ### Config variables

Config variables are automatically loaded from .env file. See `.env.example` for reference

```shell
# config.graphQL.endpoint
GRAPHQL_ENDPOINT=http://localhost:3001/v1/graphql
# config.auth.admin_token
ADMIN_AUTH_TOKEN=admin_token_123
# config.auth.trader_token
TRADER_AUTH_TOKEN=trader_token_123
```

And its all! You can import the config file and start using it
```ts
import {Reserve_SDK, config} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK(config.graphQL.endpoint);

Sdk_Instance.setAuthToken(config.auth.trader_token);
const res = await Sdk_Instance.checkin();

Sdk_Instance.setAuthToken(config.auth.admin_token);
const users = await Sdk_Instance.get_users();
``` -->

### Methods

- [health check](#health-check)
- [check-in](#check-in)
- [trader demo signin](#trader-demo-signin)
- [admin demo signin](#admin-demo-signin)
- [get users](#get-users)
- [get account balances](#get-account-balances)
- [create conversion quote](#create-conversion-quote)
- [create conversion order](#create-conversion-order)
- [create account transaction](#create-account-transaction)
- [get instruments](#get-instruments)
- [get instruments price bars](#get-instruments-price-bars)
- [deposit_address_crypto](#deposit-address-crypto)
- [create_withdrawal_fiat](#create-withdrawal-fiat)
- [get_conversions](#get-converions)
- [get_payments](#get-payments)


#### Health check

##### Allows to perform a healthcheck request
```ts
import {Reserve_SDK} from 'reserve-sdk';
     
const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
const res = await Sdk_Instance.healthcheck();
```

#### Check-in

##### Allows **AUTHENTICATED** users to perform check-in request
```ts
import {Reserve_SDK} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("admin_or_trader_token");
const res = await Sdk_Instance.checkin();
```

#### Trader demo signin

##### Allows to obtain demo **TRADER** authentication token for specified username
```ts
import {Reserve_SDK} from 'reserve-sdk';
     
const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
const res = await Sdk_Instance.trader_demo_signin({username:"example_1_2_3"});
```
#### Admin demo signin 

##### Allows to obtain demo **ADMIN** authentication token for specified username
```ts
import {Reserve_SDK} from 'reserve-sdk';
     
const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
const res = await Sdk_Instance.admin_demo_signin({username:"example_1_2_3"});
```

#### Get users 

##### Allows ADMINS to get users that can be filtered by multiple parameters

```ts
import {Reserve_SDK} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("admin_token");
const users = await Sdk_Instance.get_users({username: 'y', pager: {limit: 3}});
```

#### Get account balances 

##### Allows **AUTHENTICATED** users to get account balance 

**Trader** - no **args** are required
```ts
import {Reserve_SDK} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("trader_token");
const accounts_balances_trader = await Sdk_Instance.get_account_balances();
```

**Admin** - user_id **arg** is required
```ts
import {Reserve_SDK} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("admin_token")
const accounts_balances_admin = await Sdk_Instance.get_account_balances({user_id: '3e8a836f-9bf5-4915-8c0b-e628396740bf'});
```

#### Create conversion quote

##### Allows **AUTHENTICATED** users to get estimated conversion quote
```ts
import {Reserve_SDK} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("admin_or_trader_token");
const conversion_quote = await Sdk_Instance.create_conversion_quote({source_currency_id: 'BTC', target_currency_id: 'USDT', source_currency_amount: 30});
```

#### Create conversion order

##### Allows **AUTHENTICATED** to execute estimated conversion_quote

```ts
import {Reserve_SDK} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("admin_or_trader_token");
const res = await Sdk_Instance.create_conversion_order({conversion_quote_id: 'your_conversion_quote_id'});
```

#### Create account transaction 

##### Allows **ADMINS** to create new transactions

```ts
import {Reserve_SDK} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken('your_admin_token');
const res = await Sdk_Instance.create_account_transaction({
    items: [
        {
            user_id: '3e8a836f-9bf5-4915-8c0b-e628396740bf',
            currency_id: 'USDT',
            amount: 150,
            transaction_class: 'payment',
            comment: 'Example 1 2 3',
            type: 'credit',
        },
        {
            user_id: '3e8a836f-9bf5-4915-8c0b-e628396740bf',
            currency_id: 'USDT',
            amount: 100,
            transaction_class: 'reward',
            comment: 'Example 1 2 3',
            type: 'debit',
         },
    ],
});
```

#### Get instruments

##### Allows to get detailed data about instruments

```ts
import {Reserve_SDK, InstrumentHistoryPeriodicity} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
const res = await Sdk_Instance.get_instruments({
   periodicity: InstrumentHistoryPeriodicity['day'],
   limit: 3,
});
```

#### Get instruments price bars

##### Allows to get detailed price bars data about specified instrument

```ts
import {Reserve_SDK, InstrumentHistoryPeriodicity} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
const res = await Sdk_Instance.get_instrument_price_bars({
    instrument_id: 'BTCUSDT',
    periodicity: InstrumentHistoryPeriodicity.day,
    limit: 3,
});
```

#### Deposit address crypto

##### Allows **AUTHENTICATED** users to create new deposits

**Trader**
```ts
import {Reserve_SDK} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("trader_token");
const res = await Sdk_Instance.deposit_address_crypto({network: 'example_network', currency_id: 'BTC'});
```

**Admin** - user_id **arg** is required
```ts
import {Reserve_SDK} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("admin_token")
const res = await Sdk_Instance.deposit_address_crypto({
    currency_id: 'BTC',
    user_id: 'example_user_id',
    network: 'example_network',
});
```

#### Create fiat withdrawal

##### Allows **AUTHENTICATED** users to create fiat withdrawals


**Trader** 
```ts
import {Reserve_SDK} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("trader_token");
const res = await Sdk_Instance.create_withdrawal_fiat({
     amount: 0.5,
     currency_id: 'USD',
     fiat_bank_bic: 'example_fiat_bank_bic',
     fiat_bank_name: 'example_fiat_bank_name',
     fiat_beneficiary_name: 'example_fiat_beneficiary_name',
     fiat_beneficiary_account_number: 'example_fiat_beneficiary_account_number',
});
```

**Admin** - user_id **arg** is required
```ts
import {Reserve_SDK} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("admin_token")
const res = await Sdk_Instance.create_withdrawal_fiat({
     user_id: 'example_user_id',
     amount: 0.5,
     currency_id: 'USD',
     fiat_bank_bic: 'example_fiat_bank_bic',
     fiat_bank_name: 'example_fiat_bank_name',
     fiat_beneficiary_name: 'example_fiat_beneficiary_name',
     fiat_beneficiary_account_number: 'example_fiat_beneficiary_account_number',
});
```


#### Get conversions

##### Allows **AUTHENTICATED** users to get conversions history
     
**Trader** 
```ts
import {Reserve_SDK} from 'reserve-sdk';
     
const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("trader_token");
const res = await Sdk_Instance.get_conversions({
   source_currency_id: 'BTC',
   target_currency_id: 'ETH',
   pager: {limit:3,offset:1},
   dateRange: {
      time_from: '2022-07-28 16:20:01',
      time_to: '2022-08-02 18:40:05',
   }
});
```
     
**Admin** 
```ts
import {Reserve_SDK} from 'reserve-sdk';
     
const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("admin_token")
const res = await Sdk_Instance.get_conversions({
   user_id:'example_user_id',
   source_currency_id: 'BTC',
   target_currency_id: 'ETH',
   pager: {limit:3,offset:1},
   dateRange: {
      time_from: '2022-07-28 16:20:01',
      time_to: '2022-08-02 18:40:05',
   }
});
```

#### Get payments

##### Allows **AUTHENTICATED** users to get payments history

**Trader**
```ts
import {Reserve_SDK,PaymentType,PaymentStatus} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("trader_token");
const res = await Sdk_Instance.get_payments({
        currency_id: 'ETH',
        type: PaymentType.deposit,
        status: [PaymentStatus.completed, PaymentStatus.rejected],
        pager: {limit:3,offset:1},
        dateRange: {
        time_from: '2022-07-28 16:20:01',
        time_to: '2022-08-02 18:40:05',
    }
});
```

**Admin**
```ts
import {Reserve_SDK,PaymentType,PaymentStatus} from 'reserve-sdk';

const Sdk_Instance = new Reserve_SDK("your_graphQL_endpoint");
Sdk_Instance.setAuthToken("admin_token");
const res = await Sdk_Instance.get_payments({
        user_id: 'example_user_id',
        currency_id: 'ETH',
        type: PaymentType.deposit,
        status: [PaymentStatus.completed, PaymentStatus.rejected],
        pager: {limit:3,offset:1},
        dateRange: {
        time_from: '2022-07-28 16:20:01',
        time_to: '2022-08-02 18:40:05',
    }
});

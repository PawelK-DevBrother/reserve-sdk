#### Reserve SDK

---

#### Installation

```npm
npm i reserve-sdk
```

#### Usage

Config variables are automatically loaded from .env file. See `.env.example` for reference

##### Code example
```ts
import {config, Reserve_SDK} from 'reserve-sdk';

const SDK = new Reserve_SDK(config.graphQL.endpoint);
SDK.setAuthToken(config.auth.admin_token);
const users = await SDK.get_users();
```
# Node SDK

## Installation

Install the package with:

```bash
npm install @kandy-io/node-sdk
```

## Usage

Instantiate the instance with `clientId` & `clientSecret`.

```javascript
const { createClient } = require('@kandy-io/node-sdk');

// Initialize
const client = createClient({
  clientId: '<private project key>',
  clientSecret: '<private project secret>',
  baseUrl: '<url of the server>'
})
```

The modules can be accessed via the instance(client). All the methods invocations follows the namespaced signature

```javascript
// API signature
// {clientInstance}.{moduleName}.{methodName}(params)

// Example
client.sms.send(params);
```

Every module method returns a promise.

#### Use with `async/await`

```javascript
async function sendCode() {
  try {
    const response = await client.twofactor.sendCode({
        destinationAddress: '+12292990344',
        method: 'sms',
        message: 'Your code is {code}'
      });

    // handle success
  }
  catch (error) {
    // handle error
  }
}
```

#### Use as `promise`

```javascript
client.twofactor.sendCode({
  destinationAddress: '+12292990344',
  method: 'sms',
  message: 'Your code is {code}'
}).then(response => {
  // handle success
}).catch(error => {
  // handle error
})
```

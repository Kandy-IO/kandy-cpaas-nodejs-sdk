# Get Started

In this quickstart, we will help you dip your toes in before you dive in. This guide will help you get started with the $KANDY$ Node.js SDK.

## Using the SDK

To begin, you will need to install the node.js library in your application. The library can be installed using Node Package Manager (npm).


```bash
npm install @kandy-io/cpaas-nodejs-sdk --save
```

In your application, you simply need to import the library to be able to make use of it.

```javascript
// Instantiate the SDK.
const { createClient } = require('@kandy-io/cpaas-nodejs-sdk')

// Initialize
const client = createClient(config)
```

After you've created your instance of the SDK, you can begin playing around with it to learn its functionality and see how it fits in your application. The API reference documentation will help to explain the details of the available features.

## Configuration

Before starting, you need to learn following information from your CPaaS account, specifically from Developer Portal.

If you want to authenticate using CPaaS account's credentials, the configuration information required should be under:

+ `Home` -> `Personal Profile` (top right corner) -> `Details`
> + `Email` should be mapped to `email`
> + Your account password should be mapped to `password`
> + `Account client ID` should be mapped to `clientId`

Alternatively if you want to use your project's credentials, the configuration information required should be under:

+ `Projects` -> `{your project}` -> `Project info`/`Project secret`
> + `Private Project key` should be mapped to `clientId`
> + `Private Project secret` should be mapped to `clientSecret`

Instantiating the library can be done by providing a configuration object to the library factory as shown below.

```javascript
const { createClient } = require('@kandy-io/cpaas-nodejs-sdk')

// Initialize
const client = createClient({
  clientId: '<private project key>',
  clientSecret: '<private project secret>',
  baseUrl: 'https://$KANDYFQDN$'
})

// or

const client = createClient({
  clientId: '<account client ID>',
  email: '<account email>',
  password: '<account password>',
  baseUrl: 'https://$KANDYFQDN$'
})
```

## Usage

All modules can be accessed via the client instance, refer to [References](/developer/references/nodejs) for details about all modules and it's methods. All method invocations follow the namespaced signature

`{clientInstance}.{moduleName}.{methodName}(params)`

Example:

```javascript
client.conversation.createMessage(params)
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
    })

    // handle success
  } catch (error) {
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

## Default Error Response

### Format

```javascript
{
  name: '<exception type>',
  exceptionId: '<exception id/code>',
  message: '<exception message>'
}
```

### Example

```javascript
{
  name: 'serviceException',
  exceptionId: 'SVC0002',
  message: 'Invalid input value for message part address'
}
```

# SMS Messaging
In this section we will send an SMS to a mobile phone, then investigate how to receive incoming SMS messages.

## Send SMS
Let's assume that you want to send SMS to +16131234567 using +16139998877 as sender address, saying "hi :)":

```javascript
async function sendSMS() {
  try {
    const response = await client.conversation.createMessage({
      destinationAddress: '+16131234567',
      senderAddress: '+16139998877',
      message: 'hi :)',
    });

    // handle success
  } catch (error) {
    // handle error
  }
}
```
Before moving to how the response body looks, let's walk through the highlights on the SMS request:

+ `{senderAddress}` indicates which DID number that user desires to send the SMS from. It is expected to be an E.164 formatted number.
    + If `{senderAddress}` field contains `default` keyword, $KANDY$ discovers the default assigned SMS DID number for that user and utilizes it as the sender address.
+ `destinationAddress` can either be an array of phone numbers or a single phone number string within the params containing the destinations that corresponding SMS message will be sent. For v1, only one destination is supported on $KANDY$.
+ Address value needs to contain a phone number, ideally in E.164 format. Some valid formats are:
  - +16131234567
  - 6131234567
  - tel:+16131234567
  - sip:+16131234567@domain
  - sip:6131234567@domain
+ `message` field contains the text message in `UTF-8` encoded format.

> The number provided in {senderAddress} field should be an assigned/purchased number for the user, otherwise $KANDY$ replies back with a Forbidden error.

Now, let's check the successful response:

```javascript
{
  deliveryInfo: [{
    destinationAddress: '+16131234567',
    deliveryStatus: 'DeliveredToNetwork'
  }],
  message: 'hi :)',
  senderAddress: '+16139998877'
}
```
In case of requesting `default` senderAddress usage, senderAddress field in response can be used to understand the actual number used since it contains the number being used as from address.

> + The deliveryStatus can have the following values `DeliveredToNetwork`, `DeliveryImpossible`


## Receive SMS
To receive SMS, you need to:

+ have a SMS capable DID number assigned and configured on $KANDY$
+ subscribe to inbound SMS

### Step 1: Subscription
You subscribe to receive inbound SMS:

```javascript
async function createInboundSubscription() {
  try {
    const response = await client.conversation.subscribe({
      webhookURL: 'https://myapp.com/inbound-sms/webhook',
      destinationAddress: '+16139998877',
    });

    // handle success

  } catch (error) {
    // handle error
  }
}
```
+ `destinationAddress` is an optional parameter to indicate which SMS DID number has been desired to receive SMS messages. Corresponding number should be one of the assigned/purchased numbers of the user or project/application, otherwise $KANDY$ replies back with Forbidden error. Also not providing this parameter triggers $KANDY$ to use the default assigned DID number against this user, in which case the response message for the subscription contains the `destinationAddress` field. It is highly recommended to provide `destinationAddress` parameter.
+ `webhookURL` is a webhook that is present in your application which is accessible from the public web. The sms notifications would be delivered to the webhook and the received notification can be consumed by using the `notification.parse` helper method. The usage of `notification.parse` is explained in Step 2.

A successful subscription would return:
```javascript
{
  webhookURL: 'https://myapp.com/inbound-sms/webhook',
  destinationAddress: '+16139998877'
}
```

> + For every number required to receive incoming SMS, there should be an individual subscription.
> + When a number has been unassigned from a user or project/application, all corresponding inbound SMS subscriptions are cancelled and `smsSubscriptionCancellationNotification` notification is sent.

Now, you are ready to receive inbound SMS messages via webhook, for example - 'https://myapp.com/inbound-sms/webhook'.

### Step 2: Receiving notification
An inbound SMS notification via webhook can be parsed by using the `notification.parse` method:

```javascript
  function webhook(inboundNotification) {
    parsedResponse = client.notification.parse(inboundNotification)
  }
```
The parsed response returned from the `notification.parse` method can look like this:
```javascript
{
  dateTime: 1568889113850,
  destinationAddress: '+15202241139',
  message: 'hi :)',
  messageId: 'SM1-1568889114-1020821-00-66406cba',
  senderAddress: '+12066417772',
  notificationId: '5ceb215a-163e-44f8-bbe2-d372d227ef44',
  notificationDateTime: 1568889114122,
  type: 'inbound'
}
```

## Real-time outbound SMS sync
$KANDY$ provides notification for outbound SMS messages, to sync all online clients up-to-date in real time. The outbound notification received can also be parsed by using the `notification.parse` method:

```javascript
  function webhook(outboundNotification) {
    parsedResponse = client.notification.parse(outboundNotification)
  }
```
The parsed response returned from the `notification.parse` method can look like this:

```javascript
{
  dateTime: 1569218381777,
  destinationAddress: '+12533751556',
  message: 'hi',
  messageId: 'SM1-1569218382-1020821-10-d042a653',
  senderAddress: '+13162158074',
  notificationId: 'fa1fd235-2042-4273-889e-904b0c6e58c5',
  notificationDateTime: 1569218381182,
  type: 'outbound'
}
```
With the help of this notification, clients can sync their view on sent SMS messages in real-time.

> In order to receive this notification, user should have inbound SMS subscription. Obviously this notification cannot be provided when only send SMS has been used without an SMS related subscription.

> For trial users, maximum number of SMS messages stored is 1000. When new messages are inserted to history, oldest ones are being removed.


## References
For all SMS related method details, refer to [SMS](/developer/references/node/1.0.0#sms-send).
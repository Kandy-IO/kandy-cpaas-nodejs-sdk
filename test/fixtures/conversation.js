module.exports = {
  sms: {
    outboundMessage: {
      outboundSMSMessageRequest: {
        address: [ '+16139998877' ],
        clientCorrelator: 67893,
        deliveryInfoList: {
          deliveryInfo: [
            {
              address: '+16139998877',
              deliveryStatus: 'DeliveredToNetwork'
            }
          ],
          resourceURL: '/cpaas/smsmessaging/v1/e33c51d7-6585-4aee-88ae-005dfae1fd3b/remoteAddresses/+16139998877/messages/olr3j20Cdx87/deliveryInfos'
        },
        outboundSMSTextMessage: {
          message: 'Hi'
        },
        resourceURL: '/cpaas/smsmessaging/v1/e33c51d7-6585-4aee-88ae-005dfae1fd3b/remoteAddresses/+16137001234/messages/olr3j20Cdx87',
        senderAddress: '+16137001234'
      }
    },
    subscriptions: {
      subscriptionList: {
        resourceURL: '/cpaas/smsmessaging/v1/e33c51d7-6585-4aee-88ae-005dfae1fd3b/inbound/subscriptions',
        subscription: [
          {
            callbackReference: {
              notifyURL: 'ws-72b43d88-4cc1-466e-a453-ecbea3733a2e'
            },
            clientCorrelator: '987',
            destinationAddress: '+16137001234',
            resourceURL: '/cpaas/smsmessaging/v1/e33c51d7-6585-4aee-88ae-005dfae1fd3b/inbound/subscriptions/f179f10b-e846-4370-af20-db5f7dc0f985'
          },
          {
            callbackReference: {
              notifyURL: 'ps-32c43d88-4cc1-466e-a453-ecbea3733f2a'
            },
            clientCorrelator: '987',
            destinationAddress: '+16137001234',
            resourceURL: '/cpaas/smsmessaging/v1/e33c51d7-6585-4aee-88ae-005dfae1fd3b/inbound/subscriptions/a854f10b-e846-4370-af20-db5f7dc0f525'
          }
        ]
      }
    }
  }
}

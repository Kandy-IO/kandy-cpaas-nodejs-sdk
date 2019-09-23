const expect = require('chai').expect

const notificationResource = require('./../../src/resources/notification')

describe('Directory Resource', () => {
  const notification = notificationResource()

  describe('sms.parseNotification', () => {
    it('returns valid obj when inboundNotification is passed', () => {
      const inboundNotification = {
        inboundSMSMessageNotification: {
          inboundSMSMessage: {
            dateTime: 1525895987,
            destinationAddress: '+16139998877',
            message: 'hi',
            messageId: 'O957s10JReNV',
            senderAddress: '+16137001234'
          },
          dateTime: 1525895987,
          id: '441fc36e-aab7-45dd-905c-4aaec7a7464d'
        }
      }

      const expectedReturnObj = {
        notificationDateTime: 1525895987,
        dateTime: 1525895987,
        destinationAddress: '+16139998877',
        message: 'hi',
        messageId: 'O957s10JReNV',
        senderAddress: '+16137001234',
        type: 'inbound',
        notificationId: '441fc36e-aab7-45dd-905c-4aaec7a7464d'
      }

      const response = notification.parse(inboundNotification)

      expect(response).to.deep.equal(expectedReturnObj)
    })

    it('returns valid obj when outboundNotification is passed', () => {
      const outboundNotification = {
        outboundSMSMessageNotification: {
          outboundSMSMessage: {
            dateTime: 1525895987,
            destinationAddress: '+16139998877',
            message: 'hi',
            messageId: 'O957s10JReNV',
            senderAddress: '+16137001234'
          },
          dateTime: 1525895987,
          id: '441fc36e-aab7-45dd-905c-4aaec7a7464d'
        }
      }

      const expectedReturnObj = {
        notificationDateTime: 1525895987,
        dateTime: 1525895987,
        destinationAddress: '+16139998877',
        message: 'hi',
        messageId: 'O957s10JReNV',
        senderAddress: '+16137001234',
        type: 'outbound',
        notificationId: '441fc36e-aab7-45dd-905c-4aaec7a7464d'
      }

      const response = notification.parse(outboundNotification)

      expect(response).to.deep.equal(expectedReturnObj)
    })

    it('returns valid obj when smsSubscriptionCancellationNotification is passed', () => {
      const outboundNotification = {
        smsSubscriptionCancellationNotification: {
          link: [
            {
              href: '/cpaas/smsmessaging/v1/e33c51d7-6585-4aee-88ae-005dfae1fd3b/inbound/subscriptions/f179f10b-e846-4370-af20-db5f7dc0f985',
              rel: 'Subscription'
            }
          ],
          dateTime: 1525895987,
          id: '441fc36e-aab7-45dd-905c-4aaec7a7464d'
        }
      }

      const expectedReturnObj = {
        subscriptionId: 'f179f10b-e846-4370-af20-db5f7dc0f985',
        notificationId: '441fc36e-aab7-45dd-905c-4aaec7a7464d',
        notificationDateTime: 1525895987,
        type: 'subscriptionCancel'
      }

      const response = notification.parse(outboundNotification)

      expect(response).to.deep.equal(expectedReturnObj)
    })

    it('returns valid obj when smsSubscriptionCancellationNotification is passed', () => {
      const outboundNotification = {
        smsEventNotification: {
          eventDescription: 'A message has been deleted.',
          eventType: 'MessageDeleted',
          link: [
            {
              href: '/cpaas/smsmessaging/v1/92ef716d-42c7-4706-a123-b36cac9a2f97/remoteAddresses/+12013000113/localAddresses/+12282202950/messages/SM5C24C4AB0001020821100077367A8A',
              rel: 'smsMessage'
            }
          ],
          id: '8c30d6c7-d15e-41a0-800b-e7dc401403fb',
          dateTime: 1545995973646
        }
      }

      const expectedReturnObj = {
        notificationId: '8c30d6c7-d15e-41a0-800b-e7dc401403fb',
        notificationDateTime: 1545995973646,
        messageId: 'SM5C24C4AB0001020821100077367A8A',
        type: 'event',
        eventDetails: {
          description: 'A message has been deleted.',
          type: 'MessageDeleted'
        }
      }

      const response = notification.parse(outboundNotification)

      expect(response).to.deep.equal(expectedReturnObj)
    })
  })
})

const { idFrom } = require('./../utils')

/**
 * CPaaS notification helper methods
 *
 * @module Notification
 */

module.exports = function notification () {
  return {
    types: {
      outboundSMSMessageNotification: 'outbound',
      inboundSMSMessageNotification: 'inbound',
      smsSubscriptionCancellationNotification: 'subscriptionCancel',
      smsEventNotification: 'event'
    },
    /**
     * Parse inbound sms notification received in webhook. It parses the notification and returns
     * simplified version of the response.
     *
     * @memberof Notification
     *
     * @param  {Object} notification - JSON received in the subscription webhook.
     *
     * @returns {Object}
     */

    parse (notification) {
      const topLevelKey = Object.keys(notification)[0]
      switch (topLevelKey) {
        case 'smsSubscriptionCancellationNotification':
          const { link: cancelLinks, id: cancelId, dateTime: cancelDateTime } = notification[topLevelKey]

          return {
            subscriptionId: idFrom(cancelLinks[0].href),
            notificationId: cancelId,
            notificationDateTime: cancelDateTime,
            type: this.types[topLevelKey]
          }

        case 'outboundSMSMessageNotification': case 'inboundSMSMessageNotification':
          const { outboundSMSMessage, inboundSMSMessage, id, dateTime } = notification[topLevelKey]

          return {
            ...outboundSMSMessage,
            ...inboundSMSMessage,
            notificationId: id,
            notificationDateTime: dateTime,
            type: this.types[topLevelKey]
          }

        case 'smsEventNotification':
          const {
            eventDescription, eventType, link: eventLinks, id: eventId, dateTime: eventDateTime
          } = notification[topLevelKey]

          return {
            notificationId: eventId,
            notificationDateTime: eventDateTime,
            messageId: idFrom(eventLinks[0].href),
            type: this.types[topLevelKey],
            eventDetails: {
              description: eventDescription,
              type: eventType
            }
          }

        default:
          return {
            ...notification[topLevelKey]
          }
      }
    }
  }
}

const { composeResponse, idFrom } = require('./../utils')
const notificationChannel = require('./notificationChannel')

/**
 * CPaaS conversation.
 *
 * @module Conversation
 */

module.exports = function conversation (api) {
  const smsBaseUrl = '/cpaas/smsmessaging/v1'

  return {
    types: {
      SMS: 'sms'
    },

    /**
     * Send a new outbound message
     *
     * @memberof Conversation
     *
     * @param  {Object} params
     * @param  {string} params.type - Type of conversation. Possible values - SMS. Check conversation.types for more options
     * @param  {string} params.senderAddress - Sender address information, basically the from address. E164 formatted DID number passed as a value, which is owned by the user. If the user wants to let CPaaS uses the default assigned DID number, this field can either has "default" value or the same value as the userId.
     * @param  {Array.<string>|string} params.destinationAddress
     * @param  {string} params.message - SMS text message
     *
     * @returns {Promise<Object>}
     *
     */

    createMessage ({ type = this.types.SMS, destinationAddress, message, senderAddress }) {
      return api.makeRequest(() => {
        let url = ''
        let options = {}

        if (type === this.types.SMS) {
          const address = Array.isArray(destinationAddress) ? destinationAddress : [ destinationAddress ]

          options = {
            body: {
              outboundSMSMessageRequest: {
                address,
                clientCorrelator: api.clientCorrelator,
                outboundSMSTextMessage: {
                  message
                }
              }
            }
          }

          url = `${smsBaseUrl}/${api.userId}/outbound/${senderAddress}/requests`
        }

        return api.sendRequest(url, options, 'post')
          .then(res => {
            let responseObj = {}

            if (type === this.types.SMS) {
              const {
                deliveryInfoList: { deliveryInfo },
                outboundSMSTextMessage: { message },
                senderAddress
              } = res.outboundSMSMessageRequest

              responseObj = {
                message,
                senderAddress,
                deliveryInfo
              }
            }

            return composeResponse(res, responseObj)
          })
      })
    },

    /**
     * Gets all messages.
     *
     * @memberof Conversation
     *
     * @param  {Object} params
     * @param  {string} params.type - Type of conversation. Possible values - SMS. Check conversation.types for more options
     * @param  {string} [params.remoteAddress] - Remote address information while retrieving the SMS history, basically the destination telephone number that user exchanged SMS before. E164 formatted DID number passed as a value.
     * @param  {string} [params.localAddress] - Local address information while retrieving the SMS history, basically the source telephone number that user exchanged SMS before.
     * @param  {Object} [params.query]
     * @param  {string} [params.query.name] - Performs search operation on firstName and lastName fields.
     * @param  {string} [params.query.firstName] - Performs search for the firstName field of the directory items.
     * @param  {string} [params.query.lastName] - Performs search for the lastName field of the directory items.
     * @param  {string} [params.query.userName] - Performs search for the userName field of the directory items.
     * @param  {string} [params.query.phoneNumber] - Performs search for the fields containing a phone number, like businessPhoneNumber, homePhoneNumber, mobile, pager, fax.
     * @param  {string} [params.query.order] - Ordering the contact results based on the requested sortBy value, order query parameter should be accompanied by sortBy query parameter.
     * @param  {string} [params.query.sortBy] - SortBy value is used to detect sorting the contact results based on which attribute. If order is not provided with that, ascending order is used.
     * @param  {number} [params.query.max] - Maximum number of contact results that has been requested from CPaaS for this query.
     * @param  {string} [params.query.next] - Pointer for the next chunk of contacts, should be gathered from the previous query results.
     *
     * @returns {Promise<Object>}
     */

    getMessages ({ type = this.types.SMS, query, remoteAddress, localAddress } = {}) {
      return api.makeRequest(() => {
        let url = ''
        let options = {}

        if (type === this.types.SMS) {
          options = {
            query
          }

          url = `${smsBaseUrl}/${api.userId}/remoteAddresses`

          if (remoteAddress) {
            url = `${url}/${remoteAddress}`
          }

          if (localAddress) {
            url = `${url}/localAddresses/${localAddress}`
          }
        }

        return api.sendRequest(url, options)
      })
    },

    /**
     * Read a conversation message status
     *
     * @memberof Conversation
     *
     * @param  {Object} params
     * @param  {string} params.type - Type of conversation. Possible values - SMS. Check conversation.types for more options
     * @param  {string} params.localAddress - Local address information while retrieving the SMS history, basically the source telephone number that user exchanged SMS before.
     * @param  {string} params.remoteAddress - Remote address information while retrieving the SMS history, basically the destination telephone number that user exchanged SMS before. E164 formatted DID number passed as a value.
     * @param  {string} params.messageId - Identification of the SMS message.
     *
     * @returns {Promise<Object>}
     */

    getStatus ({ type = this.types.SMS, localAddress, messageId, remoteAddress }) {
      return api.makeRequest(() => {
        let url = ''

        if (type === this.types.SMS) {
          url = `${smsBaseUrl}/${api.userId}/remoteAddresses/${remoteAddress}/localAddresses/${localAddress}/messages/${messageId}/status`
        }

        return api.sendRequest(url)
      })
    },

    /**
     * Read all messages in a thread
     *
     * @memberof Conversation
     *
     * @param  {Object} params
     * @param  {string} params.type - Type of conversation. Possible values - SMS. Check conversation.types for more options
     * @param  {string} params.localAddress - Local address information while retrieving the SMS history, basically the source telephone number that user exchanged SMS before.
     * @param  {string} params.remoteAddress - Remote address information while retrieving the SMS history, basically the destination telephone number that user exchanged SMS before. E164 formatted DID number passed as a value.
     * @param  {Object} [params.query]
     * @param  {number} [params.query.max] - Number of messages that is requested from CPaaS.
     * @param  {string} [params.query.next] - Pointer for the next page to retrieve for the messages, provided by CPaaS in previous GET response.
     * @param  {string} [params.query.new] - Filters the messages or threads having messages that are not received by the user yet
     * @param  {number} [params.query.lastMessageTime] - Filters the messages or threads having messages that are sent/received after provided Epoch time
     *
     * @returns {Promise<Object>}
     */

    getMessagesInThread ({ type = this.types.SMS, localAddress, remoteAddress, query }) {
      return api.makeRequest(() => {
        let url = ''
        let options = {}

        if (type === this.types.SMS) {
          options = {
            query
          }

          url = `${smsBaseUrl}/${api.userId}/remoteAddresses/${remoteAddress}/localAddresses/${localAddress}/messages`
        }

        return api.sendRequest(url, options)
      })
    },

    /**
     * Delete conversation message
     *
     * @memberof Conversation
     *
     * @param  {Object} params
     * @param  {string} params.type - Type of conversation. Possible values - SMS. Check conversation.types for more options
     * @param  {string} params.localAddress - Local address information while retrieving the SMS history, basically the source telephone number that user exchanged SMS before.
     * @param  {string} params.remoteAddress - Remote address information while retrieving the SMS history, basically the destination telephone number that user exchanged SMS before. E164 formatted DID number passed as a value.
     * @param  {string} [params.messageId] - Identification of the SMS message. If messageId is not passed then the SMS thread is deleted with all messages.
     *
     * @returns {Promise<Object>}
     */

    deleteMessage ({ type = this.types.SMS, localAddress, messageId, remoteAddress }) {
      return api.makeRequest(() => {
        let url = ''

        if (type === this.types.SMS) {
          url = `${smsBaseUrl}/${api.userId}/remoteAddresses/${remoteAddress}/localAddresses/${localAddress}`

          if (messageId) {
            url = `${url}/messages/${messageId}`
          }
        }

        return api.sendRequest(url, {}, 'delete')
      })
    },

    /**
     * Read all active subscriptions
     *
     * @memberof Conversation
     *
     * @param  {Object} params
     * @param  {string} params.type - Type of conversation. Possible values - SMS. Check conversation.types for more options
     *
     * @returns {Promise<Array>}
     */

    getSubscriptions ({ type = this.types.SMS } = {}) {
      return api.makeRequest(() => {
        let url = ''

        if (type === this.types.SMS) {
          url = `${smsBaseUrl}/${api.userId}/inbound/subscriptions`
        }

        return api.sendRequest(url)
          .then(res => {
            let response = {}

            if (type === this.types.SMS) {
              response = res.subscriptionList.subscription.map(({
                callbackReference: { notifyURL }, destinationAddress, resourceURL
              }) => ({
                notifyURL,
                destinationAddress,
                subscriptionId: idFrom(resourceURL)
              }))
            }

            return composeResponse(res, response)
          })
      })
    },

    /**
     * Read active subscription
     *
     * @memberof Conversation
     *
     * @param  {Object} params
     * @param  {string} params.type - Type of conversation. Possible values - SMS. Check conversation.types for more options
     * @param  {string} params.subscriptionId - Resource ID of the subscription
     *
     * @returns {Promise<Object>}
     */
    getSubscription ({ type = this.types.SMS, subscriptionId }) {
      return api.makeRequest(() => {
        let url = ''

        if (type === this.types.SMS) {
          url = `${smsBaseUrl}/${api.userId}/inbound/subscriptions/${subscriptionId}`
        }

        return api.sendRequest(url)
          .then(res => {
            let response = {}

            if (type === this.types.SMS) {
              const { callbackReference: { notifyURL }, destinationAddress, resourceURL } = res.subscription

              response = {
                notifyURL,
                destinationAddress,
                subscriptionId: idFrom(resourceURL)
              }
            }

            return composeResponse(res, response)
          })
      })
    },

    /**
     * Create a new subscription
     *
     * @memberof Conversation
     *
     * @param  {Object} params
     * @param  {string} params.type - Type of conversation. Possible values - SMS. Check conversation.types for more options
     * @param  {string} params.webhookURL - The webhook that has been acquired during SMS API subscription, which the incoming notifications supposed to be sent to.
     * @param  {string} [params.destinationAddress] - The address that incoming messages are received for this subscription. If does not exist, CPaaS uses the default assigned DID number to subscribe against. It is suggested to provide the intended E164 formatted DID number within this parameter.
     *
     * @returns {Promise<Object>}
     */

    subscribe ({ type = this.types.SMS, destinationAddress, webhookURL }) {
      return api.makeRequest(async () => {
        let options = {}
        let url = ''

        const channel = await notificationChannel(api).createChannel({ webhookURL })

        if (type === this.types.SMS) {
          options = {
            body: {
              subscription: {
                callbackReference: {
                  notifyURL: channel.channelId
                },
                clientCorrelator: api.clientCorrelator,
                destinationAddress
              }
            }
          }

          url = `${smsBaseUrl}/${api.userId}/inbound/subscriptions`
        }

        const res = await api.sendRequest(url, options, 'post')
        const { destinationAddress: address, resourceURL } = res.subscription

        return composeResponse(res, {
          webhookURL,
          destinationAddress: address,
          subscriptionId: idFrom(resourceURL)
        })
      })
    },

    /**
     * Unsubscription from conversation notification
     *
     * @memberof Conversation
     *
     * @param  {Object} params
     * @param  {string} params.type - Type of conversation. Possible values - SMS. Check conversation.types for more options
     * @param  {string} params.subscriptionId - Resource ID of the subscription
     *
     * @returns {Promise<Object>}
     */
    unsubscribe ({ type = this.types.SMS, subscriptionId }) {
      return api.makeRequest(() => {
        let url = ''

        if (type === this.types.SMS) {
          url = `${smsBaseUrl}/${api.userId}/inbound/subscriptions/${subscriptionId}`
        }

        return api.sendRequest(url, {}, 'delete')
          .then(res => {
            let response = {}

            if (type === this.types.SMS) {
              response = {
                subscriptionId,
                success: true,
                message: `Unsubscribed from ${type} conversation notification`
              }
            }

            return composeResponse(res, response)
          })
      })
    }
  }
}

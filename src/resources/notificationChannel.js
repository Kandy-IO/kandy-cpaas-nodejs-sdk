const { composeResponse } = require('../utils')

/**
 * @private
 * @typedef Code
 * @property {string} resourceURL URL with codeId to validate verification code sent.
 */

/**
 * @private
 * Manage notification channels
 *
 * @module Notification
 */

module.exports = function notification (api) {
  const baseUrl = '/cpaas/notificationchannel/v1'

  return {

    /**
     * @private
     * Retrieve the list of active notification channels.
     *
     * @memberof Notification
     *
     * @returns {Promise<Object>}
     */

    channels () {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/channels`)
      })
    },

    /**
     * @private
     * Retrieve the info of a channel.
     *
     * @memberof Notification
     *
     * @param  {string} channelId - The channelId provided by CPaaS after creation.
     *
     * @returns {Promise<Object>}
     */

    channel ({ channelId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/channels/${channelId}`)
      })
    },

    /**
     * @private
     * Creates a new notification channel, either WebSockets or OMAPush or Webhook type
     *
     * @memberof Notification
     *
     * @param  {Object} params
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used, where same ID should be provided for WebSocket, Push, Webhook and other CPaaS services subscriptions and REST requests generated from the same device and application for correlation purposes.
     * @param  {number} [params.channelLifetime] - Indicates the channelLifetime value requested, in seconds.
     * @param  {string} [params.role] - indicates if client wants to use application level websocket ping-pong (connCheck-connAck), and in which role the client desires to take. Possible values: client, server
     *
     * @returns {Promise<Object>}
     */

    createChannel ({ webhookURL }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            notificationChannel: {
              channelData: {
                'x-webhookURL': webhookURL
              },
              channelType: 'webhooks',
              clientCorrelator: api.clientCorrelator
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/channels`, options, 'post')
          .then(res => {
            const { callbackURL, channelData, channelType } = res.notificationChannel

            return composeResponse(res, {
              channelId: callbackURL,
              webhookURL: channelData['x-webhookURL'],
              channelType
            })
          })
      })
    },

    /**
     * @private
     * Removes the notification channel
     *
     * @memberof Notification
     *
     * @param  {Object} params
     * @param  {string} params.channelId - The channelId provided by CPaaS after creation.
     *
     * @returns {Promise<Object>}
     */

    removeChannel ({ channelId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/channels/${channelId}`, {}, 'delete')
      })
    },

    /**
     * @private
     * Refresh the websocket channel lifetime
     *
     * @memberof Notification
     *
     * @param  {Object} params
     * @param  {string} params.channelId - The channelId provided by CPaaS after creation.
     * @param  {number} [params.channelLifetime] - Indicates the channelLifetime value requested, in seconds.
     *
     * @returns {Promise<Object>}
     */

    refreshChannel ({ channelId, channelLifetime }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            notificationChannelLifetime: {
              channelLifetime
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/channels/${channelId}`, options, 'put')
      })
    }

    // TODO - Blocker
    // PUT /websocket
    // POST /websocket
  }
}

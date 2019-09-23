/**
 * @private
 * WebRTC signaling related functions
 *
 * @module Call
 */

module.exports = function call (api) {
  const baseUrl = '/cpaas/webrtcsignaling/v1'

  return {
    /**
     * Retrieve all WebRTC signaling subscriptions.
     *
     * @memberof Call
     *
     * @param  {Object} params
     * @param  {string} [params.clientCorrelator] - Filter resources with matching clientCorrelator provided
     *
     * @returns {Promise<Object>}
     */

    subscriptions ({ clientCorrelator }) {
      return api.makeRequest(() => {
        const options = {
          query: {
            clientCorrelator
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/subscriptions`, options)
      })
    },

    /**
     * Retrieve a WebRTC signaling subscription.
     *
     * @memberof Call
     *
     * @param  {string} params.subscriptionId - Resource ID of the subscription.
     *
     * @returns {Promise<Object>}
     */

    subscription ({ subscriptionId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/subscriptions/${subscriptionId}`)
      })
    },

    /**
     * Create a new WebRTC signaling subscription.
     *
     * @memberof Call
     *
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used.
     * @param  {string} [params.notifyURL] - Notification channelId that webrtcsignaling related notifications are requested to be delivered
     *
     * @returns {Promise<Object>}
     */

    createSubscription ({ clientCorrelator, notifyURL }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            wrtcsNotificationSubscription: {
              clientCorrelator
            }
          }
        }

        if (notifyURL) {
          options.body.wrtcsNotificationSubscription.callbackReference = {
            notifyURL
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/subscriptions`, options, 'post')
      })
    },

    /**
     * Retrieve a WebRTC signaling subscription.
     *
     * @memberof Call
     *
     * @param  {string} params.subscriptionId - Resource ID of the subscription.
     *
     * @returns {Promise<Object>}
     */

    deleteSubscription ({ subscriptionId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/subscriptions/${subscriptionId}`, {}, 'delete')
      })
    },

    /**
     * Retrieve all WebRTC signaling call sessions.
     *
     * @memberof Call
     *
     * @param  {string} params.clientCorrelator - Filter resources with matching clientCorrelator provided
     *
     * @returns {Promise<Object>}
     */

    sessions ({ clientCorrelator }) {
      return api.makeRequest(() => {
        const options = {
          query: {
            clientCorrelator
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/sessions`, options)
      })
    },

    /**
     * Retrieve a WebRTC signaling call session.
     *
     * @memberof Call
     *
     * @param  {string} params.sessionId - Resource ID of the call session.
     *
     * @returns {Promise<Object>}
     */

    session ({ sessionId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/sessions/${sessionId}`)
      })
    },

    /**
     * Create a new WebRTC signaling call session. This operation can also start a 3-way-call/join operation.
     *
     * @memberof Call
     *
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used.
     * @param  {string} params.participantAddress - User's address that this call is targeted
     * @param  {string} params.sdp - SDP payload of the offer
     * @param  {array.<{name: string, value: string}>}  [params.customParameters] - Name of the custom param that will be converted to SIP header, value of the corresponding custom param.
     * @param  {array.<string>}  [params.join] - SessionId of the other session requested to be joined to a conference call.
     * @param  {string} [params.participantName] - User's name that this call is targeted
     * @param  {array}  [params.supported] - SDP payload of the offer
     *
     * @returns {Promise<Object>}
     */

    createSession ({ clientCorrelator, customParameters, join, participantAddress, participantName, sdp, supported }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            wrtcsSession: {
              clientCorrelator,
              offer: {
                sdp
              },
              tParticipantAddress: participantAddress,
              tParticipantName: participantName,
              'x-supported': supported,
              customParameters,
              join
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/sessions`, options, 'post')
      })
    },

    /**
     * Delete a WebRTC signaling call sessions.
     *
     * @memberof Call
     *
     * @param  {string} params.sessionId - Resource ID of the call session.
     *
     * @returns {Promise<Object>}
     */

    deleteSession ({ sessionId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/sessions/${sessionId}`, {}, 'delete')
      })
    },

    /**
     * Retrieve all WebRTC signaling call session status.
     *
     * @memberof Call
     *
     * @param  {string} params.sessionId - Resource ID of the call session.
     *
     * @returns {Promise<Object>}
     */

    sessionStatus ({ sessionId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/sessions/${sessionId}/status`)
      })
    },

    /**
     * Update a WebRTC signaling call session status. This operation is used to indicate ringing for an incoming call, and keep sending periodic audits to keep the call up.Supported session status to Ringing and Connected
     *
     * @memberof Call
     *
     * @param  {string} params.sessionId - Resource ID of the call session.
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used.
     * @param  {string} params.status - State of the call session. Exists within GET session responses. Possible values: Initiated, Ringing, Connected
     *
     * @returns {Promise<Object>}
     */

    updateSessionStatus ({ clientCorrelator, sessionId, status }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            wrtcsSessionStatus: {
              clientCorrelator,
              status
            }
          }
        }
        return api.sendRequest(`${baseUrl}/${api.userId}/sessions/${sessionId}/status`, options, 'put')
      })
    },

    /**
     * Update an incoming webrtcsignaling call session with providing offer SDP for a slow-start (no SDP) invitation
     *
     * @memberof Call
     *
     * @param  {Object} params
     * @param  {string} params.sessionId - Resource ID of the call session.
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used.
     * @param  {string} params.sdp - SDP payload of the offer.
     *
     * @returns {Promise<Object>}
     */

    offerIncomingSession ({ clientCorrelator, sessionId, sdp }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            wrtcsOffer: {
              sdp,
              clientCorrelator
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/sessions/${sessionId}/offer`, options, 'put')
      })
    },

    /**
     * Update a webrtcsignaling call session with providing answer SDP for a new call or an update.
     *
     * @memberof Call
     *
     * @param  {Object} params
     * @param  {string} params.sessionId - Resource ID of the call session.
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used.
     * @param  {string} params.sdp - SDP payload of the offer.
     *
     * @returns {Promise<Object>}
     */

    answerIncomingSession ({ clientCorrelator, sessionId, sdp }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            wrtcsAnswer: {
              sdp,
              clientCorrelator
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/sessions/${sessionId}/answer`, options, 'put')
      })
    },

    /**
     * Update an established WebRTC signaling call session with providing offer SDP.
     *
     * @memberof Call
     *
     * @param  {Object} params
     * @param  {string} params.sessionId - Resource ID of the call session.
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used.
     * @param  {string} params.sdp - SDP payload of the offer.
     *
     * @returns {Promise<Object>}
     */

    updateSession ({ clientCorrelator, sessionId, sdp }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            wrtcsOffer: {
              sdp,
              clientCorrelator
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/sessions/${sessionId}/update`, options, 'put')
      })
    },

    /**
     * Update ICE candidates in a WebRTC signaling call session.
     *
     * @memberof Call
     *
     * @param  {Object} params
     * @param  {string} params.sessionId - Resource ID of the call session.
     * @param  {{array.<string>}} params.wrtcsIceCandidates
     *
     * @returns {Promise<Object>}
     */

    updateICECandidiateInSession ({ iceCandidates, sessionId }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            wrtcsIceCandidates: iceCandidates
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/sessions/${sessionId}/ice`, options, 'put')
      })
    },

    /**
     * Forward an incoming WebRTC signaling call session.
     *
     * @memberof Call
     *
     * @param  {Object} params
     * @param  {string} params.sessionId - Resource ID of the call session.
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used.
     * @param  {string} params.address - Address that incoming call will be forwarded to.
     *
     * @returns {Promise<Object>}
     */

    forwardIncomingSession ({ address, clientCorrelator, sessionId }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            wrtcsForward: {
              address,
              clientCorrelator
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/sessions/${sessionId}/forward`, options, 'put')
      })
    },

    /**
     * Initiate transfer operation for an established WebRTC signaling call session.
     * sessionId pointer for another session, which is treated as a consultative transfer then.
     *
     * @memberof Call
     *
     * @param  {Object} params
     * @param  {string} params.sessionId - Exists on consultative transfer scenario. Session identifier of the other call that this call is being consultatively transferred
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used.
     * @param  {string} params.address - Address that this call will be transferred to.
     *
     * @returns {Promise<Object>}
     */

    transferEstablishedSession ({ address, clientCorrelator, sessionId }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            wrtcsTransfer: {
              address,
              clientCorrelator
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/sessions/${sessionId}/transfer`, options, 'put')
      })
    },

    /**
     * Request TURN credentials.
     *
     * @memberof Call
     *
     * @param  {Object} params
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used.
     *
     * @returns {Promise<Object>}
     */

    requestTURNCredentials ({ clientCorrelator }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            wrtcsTurnCredentials: {
              clientCorrelator
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/turn`, options, 'post')
      })
    }
  }
}

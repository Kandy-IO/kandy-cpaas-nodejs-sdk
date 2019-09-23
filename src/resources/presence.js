/**
 * @private
 * CPaaS Presence related functions.
 *
 * @module Presence
 */

module.exports = function presence (api) {
  const baseUrl = '/cpaas/presence/v1'

  return {

    /**
     * @private
     * Retrieve all presence sources.
     *
     * @memberof Presence
     *
     * @returns {Promise<Object>}
     */

    sources () {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/presenceSources`)
      })
    },

    /**
     * @private
     * Create a new presence source with initial presence state.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used.
     * @param  {string} params.activityValue - Presence states that are supported by CPaaS. States that have super-state as Open are Available, Away, Lunch and OnThePhone. States that have super-state as Closed are Busy and Vacation. Possible values: ActivitiesUnknown, ActivitiesOther, Available, Busy, Away, Lunch, OnThePhone, Vacation
     * @param  {string} params.overridingWillingnessValue - This param is used to indicate the super presence state when the activityValue is *ActivitiesUnknown* or *ActivitiesOther*. This param should not be provided aside with other activityValue values. For ActivitiesUnknown and ActivitiesOther, overridingWillingnessValue Open or does not exist maps to open super state vs Closed maps to closed super state.
     *
     * @returns {Promise<Object>}
     */

    createSource ({ activityValue, clientCorrelator, overridingWillingnessValue }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            presenceSource: {
              clientCorrelator,
              presence: {
                person: {
                  'overriding-willingness': {
                    overridingWillingnessValue
                  },
                  activities: {
                    activityValue
                  }
                }
              }
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/presenceSources`, options, 'post')
      })
    },

    /**
     * @private
     * Retrieve a presence source with latest posted presence state.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.sourceId - Resource ID of the presence source.
     *
     * @returns {Promise<Object>}
     */

    source ({ sourceId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/presenceSources/${sourceId}`)
      })
    },

    /**
     * @private
     * Publish presence state/Update a presence source with presence state.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.sourceId - Resource ID of the presence source.
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used.
     * @param  {string} params.activityValue - Presence states that are supported by CPaaS. States that have super-state as Open are Available, Away, Lunch and OnThePhone. States that have super-state as Closed are Busy and Vacation. Possible values: ActivitiesUnknown, ActivitiesOther, Available, Busy, Away, Lunch, OnThePhone, Vacation
     * @param  {string} params.overridingWillingnessValue - This param is used to indicate the super presence state when the activityValue is *ActivitiesUnknown* or *ActivitiesOther*. This param should not be provided aside with other activityValue values. For ActivitiesUnknown and ActivitiesOther, overridingWillingnessValue Open or does not exist maps to open super state vs Closed maps to closed super state.
     *
     * @returns {Promise<Object>}
     */

    updateSource ({ activityValue, clientCorrelator, overridingWillingnessValue, sourceId }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            presenceSource: {
              clientCorrelator,
              presence: {
                person: {
                  'overriding-willingness': {
                    overridingWillingnessValue
                  },
                  activities: {
                    activityValue
                  }
                }
              }
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/presenceSources/${sourceId}`, options, 'put')
      })
    },

    /**
     * @private
     * Delete a presence source.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.sourceId - Resource ID of the presence source.
     *
     * @returns {Promise<Object>}
     */

    deleteSource ({ sourceId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/presenceSources/${sourceId}`, {}, 'delete')
      })
    },

    /**
     * @private
     * Retrieve all presence lists.
     *
     * @memberof Presence
     *
     * @returns {Promise<Object>}
     */

    lists () {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/presenceLists`)
      })
    },

    /**
     * @private
     * Retrieve all presence lists.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {array.<string>} params.userIds - Identity of the presentity user that is required to be watched.
     * @param  {string} params.name - Name associated with this presence list
     *
     * @returns {Promise<Object>}
     */

    createList ({ listName, userIds }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            presenceList: {
              'x-listName': listName,
              presenceContact: userIds.map(userId => ({ presentityUserId: userId }))
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/presenceLists`, options, 'post')
      })
    },

    /**
     * @private
     * Retrieve a presence list.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.listId - Resource ID of the presence list
     *
     * @returns {Promise<Object>}
     */

    list ({ listId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/presenceLists/${listId}`)
      })
    },

    /**
     * @private
     * Update presence list content, which replaces the list with the provided list,
     * and resubscribe to the new list and unsubscribe from the previous list presentities if there
     * is an active subscription against this list.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.listId - Resource ID of the presence list
     * @param  {array.<string>} params.userIds - Identity of the presentity user that is required to be watched.
     * @param  {string} params.name - Name associated with this presence list
     *
     * @returns {Promise<Object>}
     */

    updateList ({ listId, listName, userIds }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            presenceList: {
              'x-listName': listName,
              presenceContact: userIds.map(userId => ({ presentityUserId: userId }))
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/presenceLists/${listId}`, options, 'put')
      })
    },

    /**
     * @private
     * Delete a presence list, which results to unsubscribe from watching the presentities within the list
     * if there is any subscription against this list.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.listId - Resource ID of the presence list
     *
     * @returns {Promise<Object>}
     */

    deleteList ({ listId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/presenceLists/${listId}`, {}, 'delete')
      })
    },

    /**
     * @private
     * Retrieve a presentity from presence list.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.listId - Resource ID of the presence list.
     * @param  {string} params.presentityUserId - Resource ID of the presentity.
     *
     * @returns {Promise<Object>}
     */

    presentityFromList ({ listId, presentityUserId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/presenceLists/${listId}/presenceContacts/${presentityUserId}`)
      })
    },

    /**
     * @private
     * Add a new presentity to the presence list, where this presentity will be started to be
     * watched if there is an active subscription against this list.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.listId - Resource ID of the presence list.
     * @param  {string} params.presentityUserId - Resource ID of the presentity.
     * @param  {string} params.userId - Identity of the presentity user that is required to be watched
     *
     * @returns {Promise<Object>}
     */

    addPresentityToList ({ listId, presentityUserId, userId }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            presenceContact: {
              presentityUserId: userId
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/presenceLists/${listId}/presenceContacts/${presentityUserId}`, options, 'put')
      })
    },

    /**
     * @private
     * Delete a presentity from a presence list, which results to unsubscribe from
     * watching that presentity within the list if there is any subscription against this list.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.listId - Resource ID of the presence list.
     * @param  {string} params.presentityUserId - Resource ID of the presentity.
     *
     * @returns {Promise<Object>}
     */

    deletePresentityFromList ({ listId, presentityUserId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/presenceLists/${listId}/presenceContacts/${presentityUserId}`, {}, 'delete')
      })
    },

    /**
     * @private
     * Retrieve all presence related subscriptions
     *
     * @memberof Presence
     *
     * @returns {Promise<Object>}
     */

    listSubscriptions () {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/subscriptions`)
      })
    },

    /**
     * @private
     * Retrieve presence list subscriptions against a list
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.listId - Resource ID of the presence list.
     *
     * @returns {Promise<Object>}
     */

    listSubscription ({ listId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/subscriptions/presenceListSubscriptions/${listId}`)
      })
    },

    /**
     * @private
     * Create a presence list subscription, ending up presence watcher subscriptions
     * against all the presentities in the list.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.listId - Resource ID of the presence list.
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used.
     * @param  {string} params.notifyURL - The webhook that has been acquired during SMS subscription, which the incoming notifications supposed to be sent to.
     * @param  {number} [params.duration] - Requested duration in seconds where this subscription should live. If not provided, a default value is being used.
     *
     * @returns {Promise<Object>}
     */

    createListSubscription ({ clientCorrelator, duration, listId, notifyURL }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            presenceListSubscription: {
              callbackReference: {
                notifyURL
              },
              clientCorrelator,
              duration
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/subscriptions/presenceListSubscriptions/${listId}`, options, 'post')
      })
    },

    /**
     * @private
     * Retrieve presence list subscriptions against a list.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.listId - Resource ID of the presence list.
     * @param  {string} params.subscriptionId - Resource ID of the presence subscription
     *
     * @returns {Promise<Object>}
     */

    listSubscriptionById ({ listId, subscriptionId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/subscriptions/presenceListSubscriptions/${listId}/${subscriptionId}`)
      })
    },

    /**
     * @private
     * Delete a subscription against a presence list, which results to unsubscribe
     * from watching all presentities within that list.
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {string} params.listId - Resource ID of the presence list.
     * @param  {string} params.subscriptionId - Resource ID of the presence subscription
     *
     * @returns {Promise<Object>}
     */

    deleteListSubscriptionById ({ listId, subscriptionId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/subscriptions/presenceListSubscriptions/${listId}/${subscriptionId}`, {}, 'delete')
      })
    },

    /**
     * @private
     * Query presence states of requested presentities, without a permanent subscription
     *
     * @memberof Presence
     *
     * @param  {Object} params
     * @param  {array.<string>} params.userIds - Identity of the presentity requested to for the presence state
     *
     * @returns {Promise<Object>}
     */

    adhocList ({ userIds }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            adhocPresenceList: {
              presentityUserId: userIds
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/adhocPresenceList`, options, 'post')
      })
    }
  }
}

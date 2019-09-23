/**
 * @private
 * CPaaS user management.
 *
 * @module UserManagement
 */

module.exports = function userManagement (api) {
  const baseUrl = 'cpaas/portal/v1/accounts'

  return {
    /**
     * @private
     * Retrieve all project related provisioning subscriptions.
     *
     * @memberof UserManagement
     *
     * @param  {Object} params
     * @param  {string} params.accountId - CPaaS account ID.
     * @param  {string} params.projectId - CPaaS project ID
     *
     * @returns {Promise<Object>}
     */

    provisioningSubscriptions ({ accountId, projectId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${accountId}/projects/${projectId}/subscriptions`)
      })
    },

    /**
     * @private
     * Retrieve a project related provisioning subscription.
     *
     * @memberof UserManagement
     *
     * @param  {Object} params
     * @param  {string} params.accountId - CPaaS account ID.
     * @param  {string} params.projectId - CPaaS project ID
     * @param  {string} params.subscriptionId - Subscription ID for the provisioning notifications
     *
     * @returns {Promise<Object>}
     */

    provisioningSubscription ({ accountId, projectId, subscriptionId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${accountId}/projects/${projectId}/subscriptions/${subscriptionId}`)
      })
    },

    /**
     * @private
     * Create a new project subscription for provisioning updates.
     *
     * @memberof UserManagement
     *
     * @param  {Object} params
     * @param  {string} params.accountId - CPaaS account ID.
     * @param  {string} params.projectId - CPaaS project ID
     * @param  {string} params.clientCorrelator - Indicates a unique ID for the client being used.
     * @param  {string} [params.notifyURL] - Notification channelId that chat related notifications are requested to be delivered, for this subscription it should be a Webhook type channel.
     *
     * @returns {Promise<Object>}
     */

    createProvisioningSubscriptions ({ accountId, projectId, clientCorrelator, notifyURL }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            projectSubscription: {
              clientCorrelator
            }
          }
        }

        if (notifyURL) {
          options.body.projectSubscription.callbackReference = {
            notifyURL
          }
        }

        return api.sendRequest(`${baseUrl}/${accountId}/projects/${projectId}/subscriptions`, options, 'post')
      })
    },

    /**
     * @private
     * Delete a project related provisioning subscription.
     *
     * @memberof UserManagement
     *
     * @param  {Object} params
     * @param  {string} params.accountId - CPaaS account ID.
     * @param  {string} params.projectId - CPaaS project ID
     * @param  {string} params.subscriptionId - Subscription ID for the provisioning notifications
     *
     * @returns {Promise<Object>}
     */

    deleteProvisioningSubscription ({ accountId, projectId, subscriptionId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${accountId}/projects/${projectId}/subscriptions/${subscriptionId}`, {}, 'delete')
      })
    },

    /**
     * @private
     * Retrieve a user under specified project.
     *
     * @memberof UserManagement
     *
     * @param  {Object} params
     * @param  {string} params.accountId - CPaaS account ID.
     * @param  {string} params.projectId - CPaaS project ID
     *
     * @returns {Promise<Object>}
     */

    users ({ accountId, projectId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${accountId}/projects/${projectId}/users`)
      })
    },

    /**
     * @private
     * Retrieve all users under specified project.
     *
     * @memberof UserManagement
     *
     * @param  {Object} params
     * @param  {string} params.accountId - CPaaS account ID.
     * @param  {string} params.projectId - CPaaS project ID
     * @param  {string} params.userId - CPaaS user ID
     *
     * @returns {Promise<Object>}
     */

    user ({ accountId, projectId, userId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${accountId}/projects/${projectId}/users/${userId}`)
      })
    },

    /**
     * @private
     * Create a new user under specified project. Receiving 202 Accepted implies that user resource
     * is created however having status is not Active yet and not ready to be used for CPaaS APIs.
     * Trying to create a user where email or userName already exists under an account is rejected
     * with 409 Conflict.
     *
     * @memberof UserManagement
     *
     * @param  {Object} params
     * @param  {string} params.accountId - CPaaS account ID
     * @param  {string} params.projectId - CPaaS project ID
     * @param  {string} params.firstName - First name of the user
     * @param  {string} params.lastName - Last name of the user
     * @param  {string} params.email - Email address of the user
     * @param  {string} params.userName - User friendly name provided for this user. It should be unique per CPaaS account. It is used to generate the complete CPaaS userName to be used in consumption APIs.
     * @param  {string} params.identityProvider - Indicates the identity provider of this user, currently only "Cpaas" is supported. Possible values: Cpaas
     * @param  {string} params.password - Password of the user. When provider is "Cpaas", this value is required. Password field is not provided within response messages.
     * @param  {Array.<string>} [params.roles] - Role assigned to the user. Only user role is supported
     * @param  {Object} [params.serviceAddress] - Location of the user being created
     * @param  {Object} params.serviceAddress.addressLine1 - First address line
     * @param  {Object} params.serviceAddress.addressLine2 - Second address line
     * @param  {Object} params.serviceAddress.city - City user belongs
     * @param  {Object} params.serviceAddress.state - State user belongs
     * @param  {Object} params.serviceAddress.postalCode - State user belongs
     * @param  {Object} params.serviceAddress.country - Country of the user
     * @param  {string} [params.timezone] - Timezone of the user, format defined in Unicode Common Locale Data Repository (CLDR) Project. Available values can be found here https://github.com/unicode-org/cldr/blob/master/common/bcp47/timezone.xml
     * @param  {string} [params.phoneNumber] - Mobile phone number of the user in E164 format
     *
     * @returns {Promise<Object>}
     */

    createUser ({
      accountId,
      projectId,
      firstName,
      lastName,
      email,
      userName,
      identityProvider,
      password,
      roles,
      serviceAddress,
      timezone,
      phoneNumber
    }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            user: {
              firstName,
              lastName,
              email,
              userName,
              idpInfo: {
                identityProvider,
                password
              },
              serviceAddress,
              timezone,
              roles,
              phoneNumber
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${accountId}/projects/${projectId}/users`, options, 'post')
      })
    },

    /**
     * @private
     * Update a user under specified project. Complete user resource should be provided.
     * In cases where an optional parameter is not provided, then it is treated as unchanged.
     * Required parameters should be provided.
     *
     * @memberof UserManagement
     *
     * @param  {Object} params
     * @param  {string} params.accountId - CPaaS account ID
     * @param  {string} params.projectId - CPaaS project ID
     * @param  {string} params.userId - CPaaS user ID
     * @param  {string} params.firstName - First name of the user
     * @param  {string} params.lastName - Last name of the user
     * @param  {string} params.email - Email address of the user
     * @param  {string} params.userName - User friendly name provided for this user. It should be unique per CPaaS account. It is used to generate the complete CPaaS userName to be used in consumption APIs.
     * @param  {string} params.identityProvider - Indicates the identity provider of this user, currently only "Cpaas" is supported. Possible values: Cpaas
     * @param  {string} [params.password] - Password of the user. When provider is "Cpaas", this value is required. Password field is not provided within response messages.
     * @param  {Array.<string>} [params.roles] - Role assigned to the user. Only user role is supported
     * @param  {string} [params.serviceAddress] - Location of the user being created
     * @param  {Object} params.serviceAddress.addressLine1 - First address line
     * @param  {Object} params.serviceAddress.addressLine2 - Second address line
     * @param  {Object} params.serviceAddress.city - City user belongs
     * @param  {Object} params.serviceAddress.state - State user belongs
     * @param  {Object} params.serviceAddress.postalCode - State user belongs
     * @param  {Object} params.serviceAddress.country - Country of the user
     * @param  {string} [params.timezone] - Timezone of the user, format defined in Unicode Common Locale Data Repository (CLDR) Project. Available values can be found here https://github.com/unicode-org/cldr/blob/master/common/bcp47/timezone.xml
     * @param  {string} [params.phoneNumber] - Mobile phone number of the user in E164 format
     *
     * @returns {Promise<Object>}
     */

    updateUser ({
      accountId,
      projectId,
      userId,
      firstName,
      lastName,
      email,
      userName,
      identityProvider,
      password,
      roles,
      serviceAddress,
      timezone,
      phoneNumber
    }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            user: {
              firstName,
              lastName,
              email,
              userName,
              idpInfo: {
                identityProvider,
                password
              },
              serviceAddress,
              timezone,
              roles,
              phoneNumber
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${accountId}/projects/${projectId}/users/${userId}`, options, 'put')
      })
    },

    /**
     * @private
     * Update a set of user attributes under specified project. For the update-allowed attributes of a user,
     * this method can be used to update them without providing the complete resource.
     * CPaaS still responds with the complete resource for convenience.
     *
     * @memberof UserManagement
     *
     * @param  {Object} params
     * @param  {string} params.accountId - CPaaS account ID
     * @param  {string} params.projectId - CPaaS project ID
     * @param  {string} params.userId - CPaaS user ID
     * @param  {string} params.firstName - First name of the user
     * @param  {string} params.lastName - Last name of the user
     * @param  {string} params.email - Email address of the user
     * @param  {string} params.userName - User friendly name provided for this user. It should be unique per CPaaS account. It is used to generate the complete CPaaS userName to be used in consumption APIs.
     * @param  {string} params.identityProvider - Indicates the identity provider of this user, currently only "Cpaas" is supported. Possible values: Cpaas
     * @param  {string} [params.password] - Password of the user. When provider is "Cpaas", this value is required. Password field is not provided within response messages.
     * @param  {Array.<string>} [params.roles] - Role assigned to the user. Only user role is supported
     * @param  {string} [params.serviceAddress] - Location of the user being created
     * @param  {Object} params.serviceAddress.addressLine1 - First address line
     * @param  {Object} params.serviceAddress.addressLine2 - Second address line
     * @param  {Object} params.serviceAddress.city - City user belongs
     * @param  {Object} params.serviceAddress.state - State user belongs
     * @param  {Object} params.serviceAddress.postalCode - State user belongs
     * @param  {Object} params.serviceAddress.country - Country of the user
     * @param  {string} [params.timezone] - Timezone of the user, format defined in Unicode Common Locale Data Repository (CLDR) Project. Available values can be found here https://github.com/unicode-org/cldr/blob/master/common/bcp47/timezone.xml
     * @param  {string} [params.phoneNumber] - Mobile phone number of the user in E164 format
     *
     * @returns {Promise<Object>}
     */

    updateUserAttributes ({
      accountId,
      projectId,
      userId,
      firstName,
      lastName,
      email,
      userName,
      identityProvider,
      password,
      roles,
      serviceAddress,
      timezone,
      phoneNumber
    }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            user: {
              firstName,
              lastName,
              email,
              userName,
              serviceAddress,
              timezone,
              roles,
              phoneNumber
            }
          }
        }

        if (identityProvider || password) {
          options.body.user.idpInfo = {
            identityProvider,
            password
          }
        }

        return api.sendRequest(`${baseUrl}/${accountId}/projects/${projectId}/users/${userId}`, options, 'patch')
      })
    },

    /**
     * @private
     * Delete a user under specified project
     *
     * @memberof UserManagement
     *
     * @param  {Object} params
     * @param  {string} params.accountId - CPaaS account ID.
     * @param  {string} params.projectId - CPaaS project ID
     * @param  {string} params.userId - CPaaS user ID
     *
     * @returns {Promise<Object>}
     */

    deleteUser ({ accountId, projectId, userId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${accountId}/projects/${projectId}/users/${userId}`, {}, 'delete')
      })
    }
  }
}

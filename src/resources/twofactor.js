const { composeResponse } = require('./../utils')

/**
 * CPaaS provides Authentication API where a two-factor authentication (2FA) flow can be implemented by using that.
 * Sections below describe two sample use cases, two-factor authentication via SMS and two-factor authentication via e-mail
 *
 *  @module Twofactor
 */

module.exports = function twofactor (api) {
  const baseUrl = '/cpaas/auth/v1'

  return {

    /**
     * Create a new authentication code
     *
     * @memberof Twofactor
     *
     * @param  {Object} params
     * @param  {string[]|string} params.destinationAddress - Destination address of the authentication code being sent. For sms type authentication codes, it should contain a E164 phone number. For e-mail type authentication codes, it should contain a valid e-mail address.
     * @param  {string} params.message - Message text sent to the destination, containing the placeholder for the code within the text. CPaaS requires to have *{code}* string within the text in order to generate a code and inject into the text. For email type code, one usage is to have the *{code}* string located within the link in order to get a unique link.
     * @param  {string} [params.method='sms'] - Type of the authentication code delivery method, sms and email are supported types. Possible values: sms, email
     * @param  {number} [params.expiry=120] - Lifetime duration of the code sent in seconds. This can contain values between 30 and 3600 seconds.
     * @param  {number} [params.length=6] - Length of the authentication code tha CPaaS should generate for this request. It can contain values between 4 and 10.
     * @param  {string} [params.type='numeric'] - Type of the code that is generated. If not provided, default value is numeric. Possible values: numeric, alphanumeric, alphabetic
     *
     * @returns {Promise<Object>}
     */

    sendCode ({ destinationAddress, message, expiry = 120, length = 6, method = 'sms', type = 'numeric' }) {
      return api.makeRequest(() => {
        const address = Array.isArray(destinationAddress) ? destinationAddress : [ destinationAddress ]

        const options = {
          body: {
            code: {
              address,
              method,
              format: {
                length: parseInt(length, 10),
                type
              },
              expiry: parseInt(expiry, 10),
              message
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/codes`, options, 'post')
          .then(res => {
            return composeResponse(res, {
              codeId: codeIdFrom(res.code.resourceURL)
            })
          })
      })
    },

    /**
     * Verifying authentication code
     *
     * @memberof Twofactor
     *
     * @param  {Object} params
     * @param  {string} params.codeId - ID of the authentication code.
     * @param  {string} params.verificationCode - Code that is being verified
     *
     * @returns {Promise<Object>}
     */

    verifyCode ({ codeId, verificationCode }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            code: {
              verify: verificationCode
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/codes/${codeId}/verify`, options, 'put')
          .then(res => {
            return composeResponse(res, {
              verified: true,
              message: 'Success'
            })
          }).catch(err => {
            return composeResponse(err, {
              verified: false,
              message: 'Code invalid or expired'
            })
          })
      })
    },

    /**
     * Resending the authentication code via same code resource, invalidating the previously sent code.
     *
     * @memberof Twofactor
     *
     * @param  {Object} params
     * @param  {string[]|string} params.destinationAddress - Destination address of the authentication code being sent. For sms type authentication codes, it should contain a E164 phone number. For e-mail type authentication codes, it should contain a valid e-mail address.
     * @param  {string} params.message - Message text sent to the destination, containing the placeholder for the code within the text. CPaaS requires to have *{code}* string within the text in order to generate a code and inject into the text. For email type code, one usage is to have the *{code}* string located within the link in order to get a unique link.
     * @param  {string} params.codeId - ID of the authentication code.
     * @param  {string} [params.method='sms'] - Type of the authentication code delivery method, sms and email are supported types. Possible values: sms, email
     * @param  {number} [params.expiry=120] - Lifetime duration of the code sent in seconds. This can contain values between 30 and 3600 seconds.
     * @param  {number} [params.length=6] - Length of the authentication code tha CPaaS should generate for this request. It can contain values between 4 and 10.
     * @param  {string} [params.type='numeric'] - Type of the code that is generated. If not provided, default value is numeric. Possible values: numeric, alphanumeric, alphabetic
     *
     * @returns {Promise<Object>}
     */

    resendCode ({ destinationAddress, codeId, message, expiry = 120, length = 6, method = 'sms', type = 'numeric' }) {
      return api.makeRequest(() => {
        const address = Array.isArray(destinationAddress) ? destinationAddress : [ destinationAddress ]

        const options = {
          body: {
            code: {
              address,
              method,
              format: {
                length: parseInt(length, 10),
                type
              },
              expiry: parseInt(expiry, 10),
              message
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/codes/${codeId}`, options, 'put')
          .then(res => {
            return composeResponse(res, {
              codeId: codeIdFrom(res.code.resourceURL)
            })
          })
      })
    },

    /**
     * Delete authentication code resource.
     *
     * @memberof Twofactor
     *
     * @param  {Object} params
     * @param  {string} params.codeId -ID of the authentication code.
     *
     * @returns {Promise<Object>}
     */

    deleteCode ({ codeId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/codes/${codeId}`, {}, 'delete')
          .then(res => composeResponse(res, {
            codeId,
            success: true
          }))
      })
    }
  }
}

function codeIdFrom(url) {
  chunks = url.split('/')

  return chunks[chunks.length - 1]
}
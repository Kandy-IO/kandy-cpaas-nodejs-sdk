const Client = require('./client')

/**
 * Node SDK
 *
 * Instantiate the instance with clientId & clientSecret.
 *
 * @param {Object} params
 * @param {string} params.clientId - Private project secret
 * @param {string} params.clientSecret - Private project secret
 * @param {string} params.baseUrl - URL of the server to be used.
 *
 * @example
 *
 * const client = createClient({
 *   clientId: '<private project key>',
 *   clientSecret: '<private project secret>',
 *   baseUrl: '<base url>'
 * })
 *
 */

const createClient = params => new Client(params)

module.exports = {
  createClient
}

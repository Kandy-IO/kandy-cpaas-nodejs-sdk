const Client = require('./client')

/**
 * Node SDK
 *
 * Instantiate the instance with clientId & clientSecret.
 *
 * @param {Object} params
 * @param {string} params.clientId - Private project key / Account client ID. If Private project key is used then client_secret is mandatory. If account client ID is used then email and password are mandatory.
 * @param {string} params.baseUrl - URL of the server to be used.
 * @param {string} [params.clientSecret] - Private project secret
 * @param {string} [params.email] - Account login email.
 * @param {string} [params.password] - Account login password.
 *
 * @example
 *
 * const client = createClient({
 *   clientId: '<private project key>',
 *   clientSecret: '<private project secret>',
 *   baseUrl: '<base url>'
 * })
 *
 * or
 *
 * const client = createClient({
 *    clientId: '<account client ID>',
 *    email: '<account email>',
 *    password: '<account password>',
 *    baseUrl: '<base url>'
 * })
 *
 */

const createClient = params => new Client(params)

module.exports = {
  createClient
}

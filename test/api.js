const API = require('./../src/api')

module.exports = (() => {
  const api = new API({
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    baseUrl: 'https://oauth-cpaas.kandy.com'
  })

  api.tokenParsed = {
    iat: (new Date().getTime() / 1000) - (2 * 60 * 60),
    exp: (new Date().getTime() / 1000) + (4 * 60 * 60)
  }
  api.userId = 'testUserId'
  api.accessToken = 'testToken'

  return api
})()

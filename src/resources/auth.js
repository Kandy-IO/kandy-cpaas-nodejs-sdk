module.exports = function auth (api) {
  return {
    token ({ clientId, clientSecret, email, password } = {}) {
      let form = {}

      if (api.email) {
        form = {
          grant_type: 'password',
          client_id: api.clientId || clientId,
          email: api.email || email,
          password: api.password || password,
          scope: 'openid'
        }
      }

      if (api.clientSecret) {
        form = {
          grant_type: 'client_credentials',
          client_id: api.clientId || clientId,
          client_secret: api.clientSecret || clientSecret,
          scope: 'openid'
        }
      }

      const options = {
        form
      }

      return api.sendRequest('/cpaas/auth/v1/token', options, 'post')
    }
  }
}

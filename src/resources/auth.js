module.exports = function auth (api) {
  return {
    token (params = {}) {
      const { clientId, clientSecret, email, password } = { ...api, ...params }
      const form = {
        client_id: clientId,
        scope: 'openid'
      }

      if (email) {
        form.grant_type = 'password'
        form.username = email
        form.password = password
      }

      if (clientSecret) {
        form.grant_type = 'client_credentials'
        form.client_secret = clientSecret
      }

      const options = {
        form,
        headers: {'Content-Type': 'application/x-www-form-urlencoded' }
      }

      return api.sendRequest('/cpaas/auth/v1/token', options, 'post')
    }
  }
}

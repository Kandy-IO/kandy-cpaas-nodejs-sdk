const expect = require('chai').expect
const mocker = require('./../mocker')

const authResource = require('./../../src/resources/auth')
const API = require('./../../src/api')

describe('Auth Resource', () => {
  describe('auth.token', () => {
    const url = '/cpaas/auth/v1/token'
    beforeEach(() => {
      mocker({ url, method: 'POST' })
    })

    it('creates valid request with project credentials without passing params', async () => {
      const config = {
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        baseUrl: 'https://oauth-cpaas.kandy.com'
      }
      const api = new API(config)

      const auth = authResource(api)

      const { response } = await auth.token()

      expect(response.__FOR_TEST__.url).to.equal(url)
      expect(response.__FOR_TEST__.requestBody).to.contain('grant_type=client_credentials')
      expect(response.__FOR_TEST__.requestBody).to.contain(`client_id=${config.clientId}`)
      expect(response.__FOR_TEST__.requestBody).to.contain(`client_secret=${config.clientSecret}`)
      expect(response.__FOR_TEST__.requestBody).to.contain('scope=openid')
    })

    it('creates valid request with account credentials without passing params', async () => {
      const config = {
        clientId: 'test-client-id',
        email: 'test-email',
        password: 'test-password',
        baseUrl: 'https://oauth-cpaas.kandy.com'
      }
      const api = new API(config)

      const auth = authResource(api)

      const { response } = await auth.token()

      expect(response.__FOR_TEST__.url).to.equal(url)
      expect(response.__FOR_TEST__.requestBody).to.contain('grant_type=password')
      expect(response.__FOR_TEST__.requestBody).to.contain(`client_id=${config.clientId}`)
      expect(response.__FOR_TEST__.requestBody).to.contain(`username=${config.email}`)
      expect(response.__FOR_TEST__.requestBody).to.contain(`password=${config.password}`)
      expect(response.__FOR_TEST__.requestBody).to.contain('scope=openid')
    })

    it('overrides api config when config passed as params with project credentials', async () => {
      const api = new API({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        baseUrl: 'https://oauth-cpaas.kandy.com'
      })

      const params = {
        clientId: 'params-test-client-id',
        clientSecret: 'params-test-client-secret'
      }

      const auth = authResource(api)

      const { response } = await auth.token(params)

      expect(response.__FOR_TEST__.url).to.equal(url)
      expect(response.__FOR_TEST__.requestBody).to.contain('grant_type=client_credentials')
      expect(response.__FOR_TEST__.requestBody).to.contain(`client_id=${params.clientId}`)
      expect(response.__FOR_TEST__.requestBody).to.contain(`client_secret=${params.clientSecret}`)
      expect(response.__FOR_TEST__.requestBody).to.contain('scope=openid')
    })

    it('overrides api config when config passed as params with account credentials', async () => {
      const api = new API({
        clientId: 'test-client-id',
        email: 'test-email',
        password: 'test-password',
        baseUrl: 'https://oauth-cpaas.kandy.com'
      })

      const params = {
        clientId: 'params-test-client-id',
        email: 'params-test-email',
        password: 'params-test-password',
      }

      const auth = authResource(api)

      const { response } = await auth.token(params)

      expect(response.__FOR_TEST__.url).to.equal(url)
      expect(response.__FOR_TEST__.requestBody).to.contain('grant_type=password')
      expect(response.__FOR_TEST__.requestBody).to.contain(`client_id=${params.clientId}`)
      expect(response.__FOR_TEST__.requestBody).to.contain(`username=${params.email}`)
      expect(response.__FOR_TEST__.requestBody).to.contain(`password=${params.password}`)
      expect(response.__FOR_TEST__.requestBody).to.contain('scope=openid')
    })
  })
})

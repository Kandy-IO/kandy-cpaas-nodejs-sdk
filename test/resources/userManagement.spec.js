const expect = require('chai').expect

const api = require('./../api')
const userManagementResource = require('./../../src/resources/userManagement')
const mocker = require('./../mocker')

describe('User Management Resource', () => {
  const userManagement = userManagementResource(api)
  const baseUrl = '/cpaas/portal/v1/accounts'

  describe('userManagement.provisioningSubscriptions', () => {
    const accountId = 'test-account-id'
    const projectId = 'test-project-id'
    const url = `${baseUrl}/${accountId}/projects/${projectId}/subscriptions`

    it('generates valid url', () => {
      mocker({ url, method: 'GET' })

      const params = {
        accountId,
        projectId
      }

      userManagement.provisioningSubscriptions(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('userManagement.provisioningSubscription', () => {
    const accountId = 'test-account-id'
    const projectId = 'test-project-id'
    const subscriptionId = 'test-subscription-id'
    const url = `${baseUrl}/${accountId}/projects/${projectId}/subscriptions/${subscriptionId}`

    it('generates valid url', () => {
      mocker({ url, method: 'GET' })

      const params = {
        accountId,
        projectId,
        subscriptionId
      }

      userManagement.provisioningSubscription(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('userManagement.createProvisioningSubscriptions', () => {
    const accountId = 'test-account-id'
    const projectId = 'test-project-id'
    const url = `${baseUrl}/${accountId}/projects/${projectId}/subscriptions`

    beforeEach(() => {
      mocker({ url, method: 'POST' })
    })

    const params = {
      accountId,
      projectId,
      clientCorrelator: 'test-client-correlator'
    }

    it('generates valid url', () => {
      userManagement.createProvisioningSubscriptions(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })

    it('generates valid body with required params', () => {
      const expectedBody = {
        projectSubscription: {
          clientCorrelator: 'test-client-correlator'
        }
      }

      userManagement.createProvisioningSubscriptions(params).then((response) => {
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })

    it('generates valid body with all params', () => {
      const requestParams = {
        accountId,
        projectId,
        clientCorrelator: 'test-client-correlator',
        notifyURL: 'test-url'
      }

      const expectedBody = {
        projectSubscription: {
          clientCorrelator: 'test-client-correlator',
          callbackReference: {
            notifyURL: 'test-url'
          }
        }
      }

      userManagement.createProvisioningSubscriptions(requestParams).then((response) => {
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('userManagement.deleteProvisioningSubscription', () => {
    const accountId = 'test-account-id'
    const projectId = 'test-project-id'
    const subscriptionId = 'test-subscription-id'
    const url = `${baseUrl}/${accountId}/projects/${projectId}/subscriptions/${subscriptionId}`

    it('generates valid url', () => {
      mocker({ url, method: 'DELETE' })

      const params = {
        accountId,
        projectId,
        subscriptionId
      }

      userManagement.deleteProvisioningSubscription(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('userManagement.users', () => {
    const accountId = 'test-account-id'
    const projectId = 'test-project-id'
    const url = `${baseUrl}/${accountId}/projects/${projectId}/users`

    it('generates valid url', () => {
      mocker({ url, method: 'GET' })

      const params = {
        accountId,
        projectId
      }

      userManagement.users(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('userManagement.user', () => {
    const accountId = 'test-account-id'
    const projectId = 'test-project-id'
    const userId = 'test-user-id'
    const url = `${baseUrl}/${accountId}/projects/${projectId}/users/${userId}`

    it('generates valid url', () => {
      mocker({ url, method: 'GET' })

      const params = {
        accountId,
        projectId,
        userId
      }

      userManagement.user(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('userManagement.createUser', () => {
    const accountId = 'test-account-id'
    const projectId = 'test-project-id'
    const url = `${baseUrl}/${accountId}/projects/${projectId}/users`

    it('generates valid url and request body', () => {
      mocker({ url, method: 'POST' })

      const params = {
        accountId,
        projectId,
        firstName: 'test-first-name',
        lastName: 'test-last-name',
        email: 'test-email-name',
        userName: 'test-username',
        identityProvider: 'Cpaas',
        password: 'test-password',
        roles: [ 'admin' ],
        serviceAddress: {
          addressLine1: 'line-1',
          addressLine2: 'line-2',
          city: 'city',
          state: 'state',
          postalCode: 'code',
          country: 'US'
        },
        timezone: 'timezone',
        phoneNumber: '123'
      }

      const expectedBody = {
        user: {
          firstName: 'test-first-name',
          lastName: 'test-last-name',
          email: 'test-email-name',
          userName: 'test-username',
          idpInfo: {
            identityProvider: 'Cpaas',
            password: 'test-password'
          },
          serviceAddress: {
            addressLine1: 'line-1',
            addressLine2: 'line-2',
            city: 'city',
            state: 'state',
            postalCode: 'code',
            country: 'US'
          },
          timezone: 'timezone',
          roles: [ 'admin' ],
          phoneNumber: '123'
        }
      }

      userManagement.createUser(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('userManagement.updateUser', () => {
    const accountId = 'test-account-id'
    const projectId = 'test-project-id'
    const userId = 'test-user-id'
    const url = `${baseUrl}/${accountId}/projects/${projectId}/users/${userId}`

    it('generates valid url and request body', () => {
      mocker({ url, method: 'PUT' })

      const params = {
        accountId,
        projectId,
        userId,
        firstName: 'test-first-name',
        lastName: 'test-last-name',
        email: 'test-email-name',
        userName: 'test-username',
        identityProvider: 'Cpaas',
        password: 'test-password',
        roles: [ 'admin' ],
        serviceAddress: {
          addressLine1: 'line-1',
          addressLine2: 'line-2',
          city: 'city',
          state: 'state',
          postalCode: 'code',
          country: 'US'
        },
        timezone: 'timezone',
        phoneNumber: '123'
      }

      const expectedBody = {
        user: {
          firstName: 'test-first-name',
          lastName: 'test-last-name',
          email: 'test-email-name',
          userName: 'test-username',
          idpInfo: {
            identityProvider: 'Cpaas',
            password: 'test-password'
          },
          serviceAddress: {
            addressLine1: 'line-1',
            addressLine2: 'line-2',
            city: 'city',
            state: 'state',
            postalCode: 'code',
            country: 'US'
          },
          timezone: 'timezone',
          roles: [ 'admin' ],
          phoneNumber: '123'
        }
      }

      userManagement.updateUser(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('userManagement.updateUserAttributes', () => {
    const accountId = 'test-account-id'
    const projectId = 'test-project-id'
    const userId = 'test-user-id'
    const url = `${baseUrl}/${accountId}/projects/${projectId}/users/${userId}`

    it('generates valid url and request body', () => {
      mocker({ url, method: 'PATCH' })

      const params = {
        accountId,
        projectId,
        userId,
        firstName: 'test-first-name',
        lastName: 'test-last-name',
        phoneNumber: '123'
      }

      const expectedBody = {
        user: {
          firstName: 'test-first-name',
          lastName: 'test-last-name',
          phoneNumber: '123'
        }
      }

      userManagement.updateUserAttributes(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('userManagement.deleteUser', () => {
    const accountId = 'test-account-id'
    const projectId = 'test-project-id'
    const userId = 'test-user-id'
    const url = `${baseUrl}/${accountId}/projects/${projectId}/users/${userId}`

    it('generates valid url', () => {
      mocker({ url, method: 'DELETE' })

      const params = {
        accountId,
        projectId,
        userId
      }

      userManagement.deleteUser(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })
})

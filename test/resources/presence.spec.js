const expect = require('chai').expect

const api = require('../api')
const presenceResource = require('../../src/resources/presence')
const mocker = require('../mocker')

describe('Presence Resource', () => {
  const addressbook = presenceResource(api)
  const baseUrl = '/cpaas/presence/v1'

  describe('presence.sources', () => {
    it('generates valid url', () => {
      const url = `${baseUrl}/${api.userId}/presenceSources`

      mocker({ url, method: 'GET' })

      addressbook.sources().then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('presence.source', () => {
    it('generates valid url', () => {
      const sourceId = 'test-source-id'
      const url = `${baseUrl}/${api.userId}/presenceSources/${sourceId}`
      const params = {
        sourceId
      }

      mocker({ url, method: 'GET' })

      addressbook.source(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('presence.createSource', () => {
    it('generates valid url and request body', () => {
      const url = `${baseUrl}/${api.userId}/presenceSources`
      const params = {
        activityValue: 'Available',
        clientCorrelator: 'test-client-correlator',
        overridingWillingnessValue: 'ActivitiesUnknown'
      }

      const expectedBody = {
        presenceSource: {
          clientCorrelator: 'test-client-correlator',
          presence: {
            person: {
              'overriding-willingness': {
                overridingWillingnessValue: 'ActivitiesUnknown'
              },
              activities: {
                activityValue: 'Available'
              }
            }
          }
        }
      }

      mocker({ url, method: 'POST' })

      addressbook.createSource(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('presence.updateSource', () => {
    it('generates valid url and request body', () => {
      const sourceId = 'test-source-id'
      const url = `${baseUrl}/${api.userId}/presenceSources/${sourceId}`
      const params = {
        sourceId,
        activityValue: 'Available',
        clientCorrelator: 'test-client-correlator',
        overridingWillingnessValue: 'ActivitiesUnknown'
      }

      const expectedBody = {
        presenceSource: {
          clientCorrelator: 'test-client-correlator',
          presence: {
            person: {
              'overriding-willingness': {
                overridingWillingnessValue: 'ActivitiesUnknown'
              },
              activities: {
                activityValue: 'Available'
              }
            }
          }
        }
      }

      mocker({ url, method: 'PUT' })

      addressbook.updateSource(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('presence.deleteSource', () => {
    it('generates valid url', () => {
      const sourceId = 'test-source-id'
      const url = `${baseUrl}/${api.userId}/presenceSources/${sourceId}`
      const params = {
        sourceId
      }

      mocker({ url, method: 'DELETE' })

      addressbook.deleteSource(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('presence.lists', () => {
    it('generates valid url', () => {
      const url = `${baseUrl}/${api.userId}/presenceLists`

      mocker({ url, method: 'GET' })

      addressbook.lists().then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('presence.createList', () => {
    it('generates valid url and request body', () => {
      const url = `${baseUrl}/${api.userId}/presenceLists`
      const params = {
        listName: 'test-list-name',
        userIds: [ 'test-user-1', 'test-user-2' ]
      }

      const expectedBody = {
        presenceList: {
          'x-listName': 'test-list-name',
          presenceContact: [
            { presentityUserId: 'test-user-1' },
            { presentityUserId: 'test-user-2' }
          ]
        }
      }

      mocker({ url, method: 'POST' })

      addressbook.createList(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('presence.list', () => {
    it('generates valid url', () => {
      const listId = 'test-list-id'
      const url = `${baseUrl}/${api.userId}/presenceLists/${listId}`
      const params = {
        listId
      }

      mocker({ url, method: 'GET' })

      addressbook.list(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('presence.updateList', () => {
    it('generates valid url and request body', () => {
      const listId = 'test-list-id'
      const url = `${baseUrl}/${api.userId}/presenceLists/${listId}`
      const params = {
        listId,
        listName: 'test-list-name',
        userIds: [ 'test-user-1', 'test-user-2' ]
      }

      const expectedBody = {
        presenceList: {
          'x-listName': 'test-list-name',
          presenceContact: [
            { presentityUserId: 'test-user-1' },
            { presentityUserId: 'test-user-2' }
          ]
        }
      }

      mocker({ url, method: 'PUT' })

      addressbook.updateList(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('presence.deleteList', () => {
    it('generates valid url', () => {
      const listId = 'test-list-id'
      const url = `${baseUrl}/${api.userId}/presenceLists/${listId}`
      const params = {
        listId
      }

      mocker({ url, method: 'DELETE' })

      addressbook.deleteList(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('presence.presentityFromList', () => {
    it('generates valid url', () => {
      const listId = 'test-list-id'
      const presentityUserId = 'test-presentity-user-id'
      const url = `${baseUrl}/${api.userId}/presenceLists/${listId}/presenceContacts/${presentityUserId}`
      const params = {
        listId,
        presentityUserId
      }

      mocker({ url, method: 'GET' })

      addressbook.presentityFromList(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('presence.addPresentityToList', () => {
    it('generates valid url and request body', () => {
      const listId = 'test-list-id'
      const presentityUserId = 'test-presentity-user-id'
      const userId = 'test-user-id'
      const url = `${baseUrl}/${api.userId}/presenceLists/${listId}/presenceContacts/${presentityUserId}`
      const params = {
        listId,
        presentityUserId,
        userId
      }

      const expectedBody = {
        presenceContact: {
          presentityUserId: userId
        }
      }

      mocker({ url, method: 'PUT' })

      addressbook.addPresentityToList(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('presence.deletePresentityFromList', () => {
    it('generates valid url', () => {
      const listId = 'test-list-id'
      const presentityUserId = 'test-presentity-user-id'
      const url = `${baseUrl}/${api.userId}/presenceLists/${listId}/presenceContacts/${presentityUserId}`
      const params = {
        listId,
        presentityUserId
      }

      mocker({ url, method: 'DELETE' })

      addressbook.deletePresentityFromList(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('presence.listSubscriptions', () => {
    it('generates valid url', () => {
      const url = `${baseUrl}/${api.userId}/subscriptions`

      mocker({ url, method: 'GET' })

      addressbook.listSubscriptions().then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('presence.listSubscription', () => {
    it('generates valid url', () => {
      const listId = 'test-list-id'
      const url = `${baseUrl}/${api.userId}/subscriptions/presenceListSubscriptions/${listId}`
      const params = {
        listId
      }

      mocker({ url, method: 'GET' })

      addressbook.listSubscription(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('presence.createListSubscription', () => {
    it('generates valid url and request body', () => {
      const listId = 'test-list-id'
      const url = `${baseUrl}/${api.userId}/subscriptions/presenceListSubscriptions/${listId}`
      const params = {
        listId,
        clientCorrelator: 'test-client-correlator',
        duration: 10,
        notifyURL: 'test-notify-url'
      }

      mocker({ url, method: 'POST' })

      addressbook.createListSubscription(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('presence.listSubscriptionById', () => {
    it('generates valid url', () => {
      const listId = 'test-list-id'
      const subscriptionId = 'test-subscription-id'
      const url = `${baseUrl}/${api.userId}/subscriptions/presenceListSubscriptions/${listId}/${subscriptionId}`
      const params = {
        listId,
        subscriptionId
      }

      mocker({ url, method: 'GET' })

      addressbook.listSubscriptionById(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('presence.deleteListSubscriptionById', () => {
    it('generates valid url', () => {
      const listId = 'test-list-id'
      const subscriptionId = 'test-subscription-id'
      const url = `${baseUrl}/${api.userId}/subscriptions/presenceListSubscriptions/${listId}/${subscriptionId}`
      const params = {
        listId,
        subscriptionId
      }

      mocker({ url, method: 'DELETE' })

      addressbook.deleteListSubscriptionById(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('presence.adhocList', () => {
    it('generates valid url and request body', () => {
      const url = `${baseUrl}/${api.userId}/adhocPresenceList`
      const params = {
        userIds: [ 'test-user-1', 'test-user-2' ]
      }

      const expectedBody = {
        adhocPresenceList: {
          presentityUserId: [ 'test-user-1', 'test-user-2' ]
        }
      }

      mocker({ url, method: 'POST' })

      addressbook.adhocList(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })
})

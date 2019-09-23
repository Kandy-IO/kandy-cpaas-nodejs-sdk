const expect = require('chai').expect

const api = require('../api')
const notificationResource = require('../../src/resources/notificationChannel')
const mocker = require('../mocker')

describe('Notification Resource', () => {
  const notification = notificationResource(api)
  const baseUrl = '/cpaas/notificationchannel/v1'

  describe('notification.channels', () => {
    const url = `${baseUrl}/${api.userId}/channels`

    it('generates valid url', () => {
      mocker({ url, method: 'GET' })

      notification.channels().then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('notification.channel', () => {
    const channelId = 'test-channel-id'
    const url = `${baseUrl}/${api.userId}/channels/${channelId}`

    it('generates valid url', () => {
      const params = {
        channelId
      }

      mocker({ url, method: 'GET' })

      notification.channel(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('notification.createChannel', () => {
    const url = `${baseUrl}/${api.userId}/channels`

    it('generates valid url and request body', () => {
      const webhookURL = 'https://myapp.com/abc123'

      const params = {
        webhookURL
      }

      const expectedBody = {
        notificationChannel: {
          channelData: {
            'x-webhookURL': webhookURL
          },
          channelType: 'webhooks',
          clientCorrelator: api.clientCorrelator
        }
      }

      mocker({
        url,
        method: 'POST',
        customBody: {
          notificationChannel: {
            callbackURL: 'wh-72b43d88-4cc1-466e-a453-ecbea3733a2e',
            channelData: {
              'x-webhookURL': 'https://myapp.com/abc123,'
            },
            channelType: 'Webhooks',
            clientCorrelator: 'someClientCorrelator',
            resourceURL: '/cpaas/notificationchannel/v1/e33c51d7-6585-4aee-88ae-005dfae1fd3b/channels/wh-72b43d88-4cc1-466e-a453-ecbea3733a2e'
          }
        }
      })

      notification.createChannel(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('notification.removeChannel', () => {
    const channelId = 'test-channel-id'
    const url = `${baseUrl}/${api.userId}/channels/${channelId}`

    it('generates valid url', () => {
      const params = {
        channelId
      }

      mocker({ url, method: 'DELETE' })

      notification.removeChannel(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('notification.refreshChannel', () => {
    const channelId = 'test-channel-id'
    const url = `${baseUrl}/${api.userId}/channels/${channelId}`

    it('generates valid url and request body', () => {
      const params = {
        channelId,
        channelLifetime: 4800
      }

      const expectedBody = {
        notificationChannelLifetime: {
          channelLifetime: 4800
        }
      }

      mocker({ url, method: 'PUT' })

      notification.refreshChannel(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })
})

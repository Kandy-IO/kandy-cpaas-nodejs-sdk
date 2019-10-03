const expect = require('chai').expect

const api = require('./../api')
const conversationResource = require('./../../src/resources/conversation')
const mocker = require('./../mocker')
const conversationFixture = require('./../fixtures/conversation')
const notificationChannelFixture = require('./../fixtures/notificationChannel')

describe('Conversation Resource', () => {
  const conversation = conversationResource(api)
  const smsBaseUrl = '/cpaas/smsmessaging/v1'

  describe('conversation.createMessage', () => {
    const senderAddress = '123'
    const smsURL = `${smsBaseUrl}/${api.userId}/outbound/${senderAddress}/requests`

    beforeEach(() => {
      mocker({
        url: smsURL,
        method: 'POST',
        customBody: conversationFixture.sms.outboundMessage
      })
    })

    it('sms - generates valid url and request body', () => {
      const params = {
        type: conversation.types.SMS,
        senderAddress,
        destinationAddress: [ '234', '345' ],
        message: 'test-message'
      }

      const expectedBody = {
        outboundSMSMessageRequest: {
          address: [ '234', '345' ],
          clientCorrelator: api.clientCorrelator,
          outboundSMSTextMessage: {
            message: 'test-message'
          }
        }
      }

      conversation.createMessage(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(smsURL)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })

    it('sms - valid request body when string is passed to destinationAddress', () => {
      const params = {
        type: conversation.types.SMS,
        senderAddress,
        destinationAddress: '234',
        message: 'test-message'
      }

      const expectedBody = {
        outboundSMSMessageRequest: {
          address: [ '234' ],
          clientCorrelator: api.clientCorrelator,
          outboundSMSTextMessage: {
            message: 'test-message'
          }
        }
      }

      conversation.createMessage(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(smsURL)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('conversation.getMessages', () => {
    it('sms - generates valid url to all sms threads with no params', () => {
      const url = `${smsBaseUrl}/${api.userId}/remoteAddresses`

      mocker({ url, method: 'GET' })

      conversation.getMessages().then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })

    it('sms - generates valid url to read all sms threads with remoteAddress', () => {
      const remoteAddress = '123'
      const url = `${smsBaseUrl}/${api.userId}/remoteAddresses/${remoteAddress}`
      const params = {
        type: conversation.types.SMS,
        remoteAddress
      }

      mocker({ url, method: 'GET' })

      conversation.getMessages(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })

    it('generates valid url to read an SMS thread from a localAddress with a remoteAddress', () => {
      const remoteAddress = '123'
      const localAddress = '456'
      const url = `${smsBaseUrl}/${api.userId}/remoteAddresses/${remoteAddress}/localAddresses/${localAddress}`
      const params = {
        remoteAddress,
        localAddress
      }

      mocker({ url, method: 'GET' })

      conversation.getMessages(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })

    it('generates valid url when query params are passed', () => {
      const url = `${smsBaseUrl}/${api.userId}/remoteAddresses`
      const urlWithQuery = `${url}?max=10&next=20&new=5&lastMessageTime=123`
      const query = {
        max: '10',
        next: '20',
        new: '5',
        lastMessageTime: '123'
      }
      const params = {
        query
      }

      mocker({ url, method: 'GET' })

      conversation.getMessages(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(urlWithQuery)
        expect(response.__FOR_TEST__.requestQueryParams).to.deep.equal(query)
      })
    })
  })

  describe('conversation.deleteMessage', () => {
    const localAddress = '123'
    const remoteAddress = '789'

    it('generates valid url to delete message thread when messageId is not passed in params', () => {
      const url = `${smsBaseUrl}/${api.userId}/remoteAddresses/${remoteAddress}/localAddresses/${localAddress}`
      const params = {
        localAddress,
        remoteAddress
      }

      mocker({ url, method: 'DELETE' })

      conversation.deleteMessage(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })

    it('generates valid url to delete message when messageId is in params', () => {
      const messageId = 'test-message-id'
      const url = `${smsBaseUrl}/${api.userId}/remoteAddresses/${remoteAddress}/localAddresses/${localAddress}/messages/${messageId}`
      const params = {
        localAddress,
        remoteAddress,
        messageId
      }

      mocker({ url, method: 'DELETE' })

      conversation.deleteMessage(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  // describe('sms.read', () => {
  //   it('generates valid url', () => {
  //     const localAddress = '123'
  //     const remoteAddress = '789'
  //     const messageId = 'test-message-id'
  //     const url = `${baseUrl}/${api.userId}/remoteAddresses/${remoteAddress}/localAddresses/${localAddress}/messages/${messageId}`
  //     const params = {
  //       localAddress,
  //       remoteAddress,
  //       messageId
  //     }

  //     mocker({ url, method: 'GET' })

  //     sms.read(params).then((response) => {
  //       expect(response.__FOR_TEST__.url).to.equal(url)
  //     })
  //   })
  // })

  describe('conversation.getMessagesInThread', () => {
    const localAddress = '123'
    const remoteAddress = '456'
    const url = `${smsBaseUrl}/${api.userId}/remoteAddresses/${remoteAddress}/localAddresses/${localAddress}/messages`

    beforeEach(() => {
      mocker({ url, method: 'GET' })
    })

    it('sms - generates valid url', () => {
      const params = {
        localAddress,
        remoteAddress
      }

      mocker({ url, method: 'GET' })

      conversation.getMessagesInThread(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })

    it('generates valid url with query params', () => {
      const query = {
        max: '10',
        next: '20',
        new: '5',
        lastMessageTime: '123'
      }
      const params = {
        localAddress,
        remoteAddress,
        query
      }
      const urlWithQuery = `${url}?max=10&next=20&new=5&lastMessageTime=123`

      mocker({ url, method: 'GET' })

      conversation.getMessagesInThread(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(urlWithQuery)
        expect(response.__FOR_TEST__.requestQueryParams).to.deep.equal(query)
      })
    })
  })

  describe('conversation.status', () => {
    it('sms - generates valid url', () => {
      const localAddress = '123'
      const remoteAddress = '789'
      const messageId = 'test-message-id'
      const url = `${smsBaseUrl}/${api.userId}/remoteAddresses/${remoteAddress}/localAddresses/${localAddress}/messages/${messageId}/status`
      const params = {
        localAddress,
        remoteAddress,
        messageId
      }

      mocker({ url, method: 'GET' })

      conversation.getStatus(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('conversation.getSubscriptions', () => {
    it('sms - generates valid url', () => {
      const url = `${smsBaseUrl}/${api.userId}/inbound/subscriptions`

      mocker({
        url,
        method: 'GET',
        customBody: conversationFixture.sms.subscriptions
      })

      conversation.getSubscriptions().then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('conversation.getSubscription', () => {
    it('generates valid url', () => {
      const subscriptionId = 'test-subscription-id'
      const url = `${smsBaseUrl}/${api.userId}/inbound/subscriptions/${subscriptionId}`
      const params = {
        subscriptionId
      }

      mocker({
        url,
        method: 'GET',
        customBody: {
          subscription: conversationFixture.sms.subscriptions.subscriptionList.subscription[0]
        }
      })

      conversation.getSubscription(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('conversation.subscribe', () => {
    const url = `${smsBaseUrl}/${api.userId}/inbound/subscriptions`

    beforeEach(() => {
      mocker({
        url,
        method: 'POST',
        customBody: {
          subscription: conversationFixture.sms.subscriptions.subscriptionList.subscription[0]
        }
      })

      mocker({
        url: `/cpaas/notificationchannel/v1/${api.userId}/channels`,
        method: 'POST',
        customBody: notificationChannelFixture.channel
      })
    })

    it('sms - generates valid url and request body with required params', () => {
      const params = {
        webhookURL: 'test-url'
      }

      const expectedBody = {
        subscription: {
          callbackReference: {}, // TODO Fix empty
          clientCorrelator: api.clientCorrelator
        }
      }

      conversation.subscribe(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })

    it('sms - generates valid request body with all params', () => {
      const params = {
        notifyURL: 'test-url',
        destinationAddress: '123'
      }

      const expectedBody = {
        subscription: {
          callbackReference: {},
          clientCorrelator: api.clientCorrelator,
          destinationAddress: '123'
        }
      }

      conversation.subscribe(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('conversation.unsubscribe', () => {
    it('generates valid url', () => {
      const subscriptionId = 'test-subscription-id'
      const url = `${smsBaseUrl}/${api.userId}/inbound/subscriptions/${subscriptionId}`
      const params = {
        subscriptionId
      }

      mocker({ url, method: 'DELETE' })

      conversation.unsubscribe(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })
})

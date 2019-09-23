const expect = require('chai').expect

const Client = require('./../src/client')

describe('Client', () => {
  describe('constructor', () => {
    it('creates new client object and initializes config with valid params', () => {
      const validParams = {
        clientId: 'test client id',
        clientSecret: 'test client secret'
      }

      const client = new Client(validParams)

      expect(client).to.have.own.property('api')
      // expect(client).to.have.own.property('addressbook')
      // expect(client).to.have.own.property('auth')
      // expect(client).to.have.own.property('call')
      // expect(client).to.have.own.property('directory')
      // expect(client).to.have.own.property('notificationChannel')
      // expect(client).to.have.own.property('presence')
      expect(client).to.have.own.property('conversation')
      expect(client).to.have.own.property('twofactor')
    })

    it('throws error when clientId is missing', () => {
      const invalidParams = {
        clientSecret: 'test client secret'
      }

      const client = () => new Client(invalidParams)

      expect(client).to.throw('`clientId` is mandatory')
    })

    it('throws error when clientSecret or email/password is missing', () => {
      const invalidParams = {
        clientId: 'test client id'
      }

      const client = () => new Client(invalidParams)

      expect(client).to.throw('`clientSecret` or `email/password` is mandatory')
    })
  })
})

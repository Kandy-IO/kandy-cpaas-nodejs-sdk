const expect = require('chai').expect

const resources = require('./../src/resources')

describe('resources', () => {
  describe('default function', () => {
    it('returns all the resource namespaces', () => {
      const obj = resources()

      // expect(obj).to.have.own.property('addressbook')
      // expect(obj).to.have.own.property('auth')
      // expect(obj).to.have.own.property('call')
      // expect(obj).to.have.own.property('directory')
      // expect(obj).to.have.own.property('notificationChannel')
      // expect(obj).to.have.own.property('presence')
      expect(obj).to.have.own.property('conversation')
      expect(obj).to.have.own.property('twofactor')
    })
  })
})

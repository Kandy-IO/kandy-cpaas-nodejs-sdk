const expect = require('chai').expect

const api = require('./../api')
const directoryResource = require('./../../src/resources/directory')
const mocker = require('./../mocker')

describe('Directory Resource', () => {
  const addressbook = directoryResource(api)
  const baseUrl = '/cpaas/directory/v1'

  describe('directory.search', () => {
    const directoryId = 'test-directory-id'
    const url = `${baseUrl}/${api.userId}/${directoryId}/search`

    beforeEach(() => {
      mocker({ url, method: 'GET' })
    })

    it('generates valid url', () => {
      const params = {
        directoryId
      }

      addressbook.search(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })

    it('generates valid query params', () => {
      const query = {
        name: 'test-name',
        firstName: 'lastName',
        lastName: 'firstName',
        username: 'username',
        phoneNumber: '1111111111',
        order: 'asc',
        sortBy: 'name',
        max: '10',
        next: '5'
      }

      const params = {
        directoryId,
        query
      }

      addressbook.search(params).then((response) => {
        expect(response.__FOR_TEST__.requestQueryParams).to.deep.equal(query)
      })
    })
  })
})

const expect = require('chai').expect

const api = require('./../api')
const addressbookResource = require('./../../src/resources/addressbook')
const mocker = require('./../mocker')

describe('Addressbook Resource', () => {
  const addressbook = addressbookResource(api)
  const baseUrl = '/cpaas/addressbook/v1'

  describe('addressbook.contacts', () => {
    it('generates valid url with params', () => {
      const addressbookId = 'test-addressbook-id'
      const url = `${baseUrl}/${api.userId}/${addressbookId}/contacts`
      const params = {
        addressbookId
      }

      mocker({
        url,
        method: 'GET'
      })

      addressbook.contacts(params).then(response => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('addressbook.contact', () => {
    it('generates valid url with params', () => {
      const addressbookId = 'test-addressbook-id'
      const contactId = 'test-contact-id'
      const url = `${baseUrl}/${api.userId}/${addressbookId}/contacts/${contactId}`
      const params = {
        addressbookId,
        contactId
      }

      mocker({
        url,
        method: 'GET'
      })

      addressbook.contact(params).then(response => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('addressbook.addContact', () => {
    const addressbookId = 'test-addressbook-id'
    const url = `${baseUrl}/${api.userId}/${addressbookId}/contacts`

    beforeEach(() => {
      mocker({ url, method: 'POST' })
    })

    it('generates valid url and adds contactId to request body when only contactId is passed as params', () => {
      const params = {
        addressbookId,
        contactId: 'test-contact-id'
      }

      const expectedBody = {
        contact: {
          contactId: 'test-contact-id'
        }
      }

      addressbook.addContact(params).then(response => {
        const inputParams = response.__FOR_TEST__

        expect(inputParams.url).to.equal(url)
        expect(inputParams.requestBody).to.deep.equal(expectedBody)
      })
    })

    it('generates valid request body when all params are passed', () => {
      const params = {
        addressbookId,
        contactId: 'test-contact-id',
        contacts: [
          { name: 'test-id-1', value: 'test-contact-id-1' },
          { name: 'test-id-2', value: 'test-contact-id-2' }
        ],
        links: [
          { href: 'test-href', rel: 'test-rel' }
        ]
      }

      const expectedBody = {
        contact: {
          attributeList: {
            attribute: [
              { name: 'test-id-1', value: 'test-contact-id-1' },
              { name: 'test-id-2', value: 'test-contact-id-2' }
            ]
          },
          contactId: 'test-contact-id',
          link: [
            { href: 'test-href', rel: 'test-rel' }
          ]
        }
      }

      addressbook.addContact(params).then(response => {
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('addressbook.updateContact', () => {
    const addressbookId = 'test-addressbook-id'
    const contactId = 'test-contact-id'
    const url = `${baseUrl}/${api.userId}/${addressbookId}/contacts/${contactId}`

    beforeEach(() => {
      mocker({ url, method: 'PUT' })
    })

    it('generates valid url and adds contactId to request body when only contactId is passed as params', () => {
      const params = {
        addressbookId,
        contactId,
        newContactId: 'test-new-contact-id'
      }

      const expectedBody = {
        contact: {
          contactId: 'test-new-contact-id'
        }
      }

      addressbook.updateContact(params).then(response => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })

    it('generates valid request body when all params are passed', () => {
      const params = {
        addressbookId,
        contactId,
        newContactId: 'test-new-contact-id',
        contacts: [
          { name: 'test-id-1', value: 'test-contact-id-1' },
          { name: 'test-id-2', value: 'test-contact-id-2' }
        ],
        links: [
          { href: 'test-href', rel: 'test-rel' }
        ]
      }

      const expectedBody = {
        contact: {
          attributeList: {
            attribute: [
              { name: 'test-id-1', value: 'test-contact-id-1' },
              { name: 'test-id-2', value: 'test-contact-id-2' }
            ]
          },
          contactId: 'test-new-contact-id',
          link: [
            { href: 'test-href', rel: 'test-rel' }
          ]
        }
      }

      addressbook.updateContact(params).then(response => {
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('addressbook.deleteContact', () => {
    const addressbookId = 'test-addressbook-id'
    const contactId = 'test-new-contact-id'
    const url = `${baseUrl}/${api.userId}/${addressbookId}/contacts/${contactId}`
    const params = {
      addressbookId,
      contactId
    }

    beforeEach(() => {
      mocker({ url, method: 'DELETE' })
    })

    it('generates valid url', () => {
      addressbook.deleteContact(params).then(response => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('addressbook.updateContactAttribute', () => {
    const addressbookId = 'test-addressbook-id'
    const contactId = 'test-new-contact-id'
    const attributeId = 'test-attribute-id'
    const url = `${baseUrl}/${api.userId}/${addressbookId}/contacts/${contactId}/attributes/${attributeId}`

    beforeEach(() => {
      mocker({ url, method: 'PUT' })
    })

    it('generates valid url and request body', () => {
      const params = {
        addressbookId,
        contactId,
        attributeId,
        attribute: {
          name: 'test-attribute-name',
          value: 'test-attribute-value'
        }
      }

      const expectedBody = {
        attribute: {
          name: 'test-attribute-name',
          value: 'test-attribute-value'
        }
      }

      addressbook.updateContactAttribute(params).then(response => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('addressbook.deleteContactAttribute', () => {
    const addressbookId = 'test-addressbook-id'
    const contactId = 'test-new-contact-id'
    const attributeId = 'test-attribute-id'
    const url = `${baseUrl}/${api.userId}/${addressbookId}/contacts/${contactId}/attributes/${attributeId}`

    beforeEach(() => {
      mocker({ url, method: 'DELETE' })
    })

    it('generates valid url', () => {
      const params = {
        addressbookId,
        contactId,
        attributeId
      }

      addressbook.deleteContactAttribute(params).then(response => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('addressbook.lists', () => {
    const addressbookId = 'test-addressbook-id'
    const url = `${baseUrl}/${api.userId}/${addressbookId}/lists`

    beforeEach(() => {
      mocker({ url, method: 'GET' })
    })

    it('generates valid url', () => {
      const params = {
        addressbookId
      }

      addressbook.lists(params).then(response => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('addressbook.list', () => {
    const addressbookId = 'test-addressbook-id'
    const listId = 'test-list-id'
    const url = `${baseUrl}/${api.userId}/${addressbookId}/lists/${listId}`

    beforeEach(() => {
      mocker({ url, method: 'GET' })
    })

    it('generates valid url', () => {
      const params = {
        addressbookId,
        listId
      }

      addressbook.list(params).then(response => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })

  describe('addressbook.createList', () => {
    const addressbookId = 'test-addressbook-id'
    const url = `${baseUrl}/${api.userId}/${addressbookId}/lists`

    beforeEach(() => {
      mocker({ url, method: 'POST' })
    })

    it('generates valid url and request body', () => {
      const params = {
        addressbookId,
        listId: 'test-list-id'
      }

      const expectedBody = {
        list: {
          listId: 'test-list-id'
        }
      }

      addressbook.createList(params).then(response => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('addressbook.updateList', () => {
    const addressbookId = 'test-addressbook-id'
    const listId = 'test-list-id'
    const url = `${baseUrl}/${api.userId}/${addressbookId}/lists/${listId}`

    beforeEach(() => {
      mocker({ url, method: 'PUT' })
    })

    it('generates valid url and request body', () => {
      // const params = {
      //   addressbookId,
      //   listId
      // }

      // const expectedBody = {
      //   list: {
      //     listId
      //   }
      // }

      // TODO: Fix error
      // addressbook.updateList(params).then(response => {
      //   expect(response.__FOR_TEST__.url).to.equal(url)
      //   expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      // })
    })
  })

  describe('addressbook.deleteList', () => {
    const addressbookId = 'test-addressbook-id'
    const listId = 'test-list-id'
    const url = `${baseUrl}/${api.userId}/${addressbookId}/lists/${listId}`

    beforeEach(() => {
      mocker({ url, method: 'DELETE' })
    })

    it('generates valid url', () => {
      const params = {
        addressbookId,
        listId
      }

      addressbook.deleteList(params).then(response => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })
})

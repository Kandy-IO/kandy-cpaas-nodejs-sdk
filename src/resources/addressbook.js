/**
 * @private
 * CPaaS Addressbook related functions
 *
 * @module Addressbook
 */

module.exports = function addressbook (api) {
  const baseUrl = '/cpaas/addressbook/v1'

  return {
    /**
     * @private
     * Retrieve Contacts
     *
     * @memberof Addressbook
     *
     * @param  {Object} params
     * @param  {string} params.addressbookId - For v1, CPaaS Addressbook API only supports "default" keyword as addressbookId, which points to the default assigned addressbook provider against served users. Future releases will extend this field for more options.
     *
     * @returns {Promise<Object>}
     */

    contacts ({ addressbookId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/${addressbookId}/contacts`)
      })
    },

    /**
     * @private
     * Retrieve single contact
     *
     * @memberof Addressbook
     *
     * @param  {Object} params
     * @param  {string} params.addressbookId - For v1, CPaaS Addressbook API only supports "default" keyword as addressbookId, which points to the default assigned addressbook provider against served users. Future releases will extend this field for more options.
     * @param  {string} params.contactId - ID of the contact within addressbook of the served user.
     *
     * @returns {Promise<Object>}
     */

    contact ({ addressbookId, contactId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/${addressbookId}/contacts/${contactId}`)
      })
    },

    /**
     * @private
     * Add a contact
     *
     * @memberof Addressbook
     *
     * @param  {Object} params
     * @param  {string} params.addressbookId - For v1, CPaaS Addressbook API only supports "default" keyword as addressbookId, which points to the default assigned addressbook provider against served users. Future releases will extend this field for more options.
     * @param  {string} params.contactId - User address that this call is targeted.
     * @param  {{array.<{name: string, value: string}>}} [params.contacts]
     * @param  {{array.<{href: string, rel: string}>}} [params.links] - href - Relative path of the corresponding resource, rel - Name of the corresponding resource.
     *
     * @returns {Promise<Object>}
     */

    addContact ({ addressbookId, contacts, contactId, links }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            contact: {
              contactId
            }
          }
        }

        if (links) {
          options.body.contact.link = links
        }

        if (contacts) {
          options.body.contact.attributeList = {
            attribute: contacts
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/${addressbookId}/contacts`, options, 'post')
      })
    },

    /**
     * @private
     * Update a contact
     *
     * @memberof Addressbook
     *
     * @param  {Object} params
     * @param  {string} params.addressbookId - For v1, CPaaS Addressbook API only supports "default" keyword as addressbookId, which points to the default assigned addressbook provider against served users. Future releases will extend this field for more options.
     * @param  {string} params.contactId - User address that this call is targeted.
     * @param  {string} params.newContactId - User address.
     * @param  {{array.<{name: string, value: string}>}} [params.contacts]
     * @param  {{array.<{href: string, rel: string}>}} [params.links] - href - Relative path of the corresponding resource, rel - Name of the corresponding resource.
     *
     * @returns {Promise<Object>}
     */

    // TODO: Ambiguous contactId param - check REST API documentation (used in body and url) - added newContactId (needs verification)
    updateContact ({ addressbookId, contacts, contactId, links, newContactId }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            contact: {
              contactId: newContactId
            }
          }
        }

        if (links) {
          options.body.contact.link = links
        }

        if (contacts) {
          options.body.contact.attributeList = {
            attribute: contacts
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/${addressbookId}/contacts/${contactId}`, options, 'put')
      })
    },

    /**
     * @private
     * Delete a contact.
     *
     * @memberof Addressbook
     *
     * @param  {Object} params
     * @param  {string} params.addressbookId - For v1, CPaaS Addressbook API only supports "default" keyword as addressbookId, which points to the default assigned addressbook provider against served users. Future releases will extend this field for more options.
     * @param  {string} params.contactId - ID of the contact within addressbook of the served user.
     *
     * @returns {Promise<Object>}
     */

    deleteContact ({ addressbookId, contactId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/${addressbookId}/contacts/${contactId}`, {}, 'delete')
      })
    },

    /**
     * @private
     * Update a contact's attribute.
     *
     * @memberof Addressbook
     *
     * @param  {Object} params
     * @param  {string} params.addressbookId - For v1, CPaaS Addressbook API only supports "default" keyword as addressbookId, which points to the default assigned addressbook provider against served users. Future releases will extend this field for more options.
     * @param  {string} params.contactId - ID of the contact within addressbook of the served user.
     * @param  {string} params.attributeId - ID of associated contact's attribute. Attributes are closely related with the addressbook provider for the served user.
     * @param  {{name: string, value: string}} params.attribute - Individual attributes associated with the contact
     *
     * @returns {Promise<Object>}
     */

    updateContactAttribute ({ addressbookId, attributeId, attribute, contactId }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            attribute
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/${addressbookId}/contacts/${contactId}/attributes/${attributeId}`, options, 'put')
      })
    },

    /**
     * @private
     * Delete a contact's attribute.
     *
     * @memberof Addressbook
     *
     * @param  {Object} params
     * @param  {string} params.addressbookId - For v1, CPaaS Addressbook API only supports "default" keyword as addressbookId, which points to the default assigned addressbook provider against served users. Future releases will extend this field for more options.
     * @param  {string} params.contactId - ID of the contact within addressbook of the served user.
     * @param  {string} params.attributeId - ID of associated contact's attribute. Attributes are closely related with the addressbook provider for the served user.
     *
     * @returns {Promise<Object>}
     */

    deleteContactAttribute ({ addressbookId, attributeId, contactId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/${addressbookId}/contacts/${contactId}/attributes/${attributeId}`, {}, 'delete')
      })
    },

    /**
     * @private
     * Retrieve lists.
     *
     * @memberof Addressbook
     *
     * @param  {Object} params
     * @param  {string} params.addressbookId - For v1, CPaaS Addressbook API only supports "default" keyword as addressbookId, which points to the default assigned addressbook provider against served users. Future releases will extend this field for more options.
     *
     * @returns {Promise<Object>}
     */

    lists ({ addressbookId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/${addressbookId}/lists`)
      })
    },

    /**
     * @private
     * Retrieve single contact list.
     *
     * @memberof Addressbook
     *
     * @param  {Object} params
     * @param  {string} params.addressbookId - For v1, CPaaS Addressbook API only supports "default" keyword as addressbookId, which points to the default assigned addressbook provider against served users. Future releases will extend this field for more options.
     * @param  {string} params.listId - Id of the list structure.
     *
     * @returns {Promise<Object>}
     */

    list ({ addressbookId, listId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/${addressbookId}/lists/${listId}`)
      })
    },

    /**
     * @private
     * Add contact list
     *
     * @memberof Addressbook
     *
     * @param  {Object} params
     * @param  {string} params.addressbookId - For v1, CPaaS Addressbook API only supports "default" keyword as addressbookId, which points to the default assigned addressbook provider against served users. Future releases will extend this field for more options.
     * @param  {string} params.listId - Id of the list structure.
     *
     * @returns {Promise<Object>}
     */
    // TODO: Request body looks odd.
    createList ({ addressbookId, listId }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            list: {
              listId
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/${addressbookId}/lists`, options, 'post')
      })
    },

    /**
     * @private
     * Modify single contact list.
     *
     * @memberof Addressbook
     *
     * @param  {Object} params
     * @param  {string} params.addressbookId - For v1, CPaaS Addressbook API only supports "default" keyword as addressbookId, which points to the default assigned addressbook provider against served users. Future releases will extend this field for more options.
     * @param  {string} params.listId - Id of the list structure.
     *
     * @returns {Promise<Object>}
     */

    // TODO: Ambiguous listId param - check REST API documentation (used in body and url)
    updateList ({ addressbookId, listId }) {
      const options = {
        body: {
          list: {
            listId
          }
        }
      }

      return api.sendRequest(`${baseUrl}/${api.userId}/${addressbookId}/lists/${listId}`, options, 'put')
    },

    /**
     * @private
     * Delete single contact list.
     *
     * @memberof Addressbook
     *
     * @param  {Object} params
     * @param  {string} params.addressbookId - For v1, CPaaS Addressbook API only supports "default" keyword as addressbookId, which points to the default assigned addressbook provider against served users. Future releases will extend this field for more options.
     * @param  {string} params.listId - Id of the list structure.
     *
     * @returns {Promise<Object>}
     */

    deleteList ({ addressbookId, listId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/${addressbookId}/lists/${listId}`, {}, 'delete')
      })
    }
  }
}

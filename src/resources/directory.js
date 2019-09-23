/**
 * @private
 * CPaaS directory management.
 *
 * @module Directory
 */

module.exports = function directory (api) {
  return {
    /**
     * @private
     * Search from directory address book. Returns the active user information from directory address book
     *
     * @memberof Directory
     *
     * @param  {Object} params
     * @param  {string} params.directoryId - For v1, CPaaS Directory API only supports "default" keyword as directoryId, which points to the default assigned directory provider against served users. Future releases will extend this field for more options.
     * @param  {Object} params.query
     * @param  {string} [params.query.name] - Performs search operation on firstName and lastName fields.
     * @param  {string} [params.query.firstName] - Performs search for the firstName field of the directory items.
     * @param  {string} [params.query.lastName] - Performs search for the lastName field of the directory items.
     * @param  {string} [params.query.userName] - Performs search for the userName field of the directory items.
     * @param  {string} [params.query.phoneNumber] - Performs search for the fields containing a phone number, like businessPhoneNumber, homePhoneNumber, mobile, pager, fax.
     * @param  {string} [params.query.order] - Ordering the contact results based on the requested sortBy value, order query parameter should be accompanied by sortBy query parameter.
     * @param  {string} [params.query.sortBy] - SortBy value is used to detect sorting the contact results based on which attribute. If order is not provided with that, ascending order is used.
     * @param  {number} [params.query.max] - Maximum number of contact results that has been requested from CPaaS for this query.
     * @param  {string} [params.query.next] - Pointer for the next chunk of contacts, should be gathered from the previous query results.
     *
     * @returns {Promise<Object>}
     */

    search ({ directoryId, query }) {
      return api.makeRequest(() => {
        const options = {
          query
        }

        return api.sendRequest(`/cpaas/directory/v1/${api.userId}/${directoryId}/search`, options)
      })
    }
  }
}

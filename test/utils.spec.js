const expect = require('chai').expect

const utils = require('./../src/utils')

describe('utils', () => {
  describe('utils.parseResponse', () => {
    it('when no test response present, returns actual response', () => {
      const responseObj = {
        parentWrapper: {
          key1: 'value-1',
          key2: {
            key3: 'value-2'
          }
        }
      }

      const expectedObj = {
        key1: 'value-1',
        key2: {
          key3: 'value-2'
        }
      }

      expect(utils.parseResponse(responseObj)).deep.equal(expectedObj)
    })

    it('when only test response present, returns test response', () => {
      const responseObj = {
        response: {
          success: '200',
          '__FOR_TEST__': {
            method: 'PUT',
            requestBody: {
              key1: 'value-1',
              key2: {
                key3: 'value-2'
              }
            },
            url: 'some-url'
          }
        }
      }

      const expectedObj = {
        success: '200',
        '__FOR_TEST__': {
          method: 'PUT',
          requestBody: {
            key1: 'value-1',
            key2: {
              key3: 'value-2'
            }
          },
          url: 'some-url'
        }
      }

      expect(utils.parseResponse(responseObj)).deep.equal(expectedObj)
    })

    it('when test response and formatted response are present, returns test response', () => {
      const responseObj = {
        actualResponse: {
          response: {
            success: '200',
            '__FOR_TEST__': {
              method: 'PUT',
              requestBody: {
                key1: 'value-1',
                key2: {
                  key3: 'value-2'
                }
              },
              url: 'some-url'
            }
          }
        },
        formattedResponse: {
          key1: 'value-1',
          key2: {
            key3: 'value-2'
          }
        }
      }

      const expectedObj = {
        success: '200',
        '__FOR_TEST__': {
          method: 'PUT',
          requestBody: {
            key1: 'value-1',
            key2: {
              key3: 'value-2'
            }
          },
          url: 'some-url'
        }
      }

      expect(utils.parseResponse(responseObj)).deep.equal(expectedObj)
    })
  })
})

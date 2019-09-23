const nock = require('nock')

const HOST = 'https://oauth-cpaas.kandy.com'
const STATUS = 200

module.exports = (params) => {
  const { url, method, customBody, merge = true } = params
  let requestQueryParams = null

  nock(HOST)
    .intercept(url, method)
    .query(qp => {
      requestQueryParams = qp

      return true
    })
    .reply(STATUS, (url, requestBody) => {
      const responseBody = {
        response: {
          success: '200',
          '__FOR_TEST__': {
            method,
            requestBody,
            requestQueryParams,
            url
          }
        }
      }

      return (customBody && merge) ? { ...responseBody, ...customBody } : responseBody
    })
}

const expect = require('chai').expect

const api = require('./../api')
const twofactorResource = require('./../../src/resources/twofactor')
const mocker = require('./../mocker')

describe('Two Factor Authentication Resource', () => {
  const twofactor = twofactorResource(api)
  const baseUrl = '/cpaas/auth/v1'

  describe('twofactor.sendCode', () => {
    const url = `${baseUrl}/${api.userId}/codes`

    beforeEach(() => {
      mocker({
        url,
        method: 'POST',
        customBody: {
          code: {
            resourceURL: '/cpaas/auth/v1/91fc8907-d336-4707-ad3c-0711c0b87471/codes/51b545e7-729f-4690-9571-e5c85852b179'
          }
        },
        merge: true
      })
    })

    it('generates valid url and valid request body with only required params', () => {
      const params = {
        destinationAddress: ['111', '222', '333'],
        message: 'test message {code}'
      }

      const expectedBody = {
        code: {
          address: ['111', '222', '333'],
          message: 'test message {code}',
          format: {
            length: 6,
            type: 'numeric'
          },
          expiry: 120,
          method: 'sms'
        }
      }

      twofactor.sendCode(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })

    it('valid request body when string is passed to destinationAddress', () => {
      const params = {
        destinationAddress: '111',
        message: 'test message {code}'
      }

      const expectedBody = {
        code: {
          address: [ '111' ],
          message: 'test message {code}',
          format: {
            length: 6,
            type: 'numeric'
          },
          expiry: 120,
          method: 'sms'
        }
      }

      twofactor.sendCode(params).then((response) => {
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })

    it('generates valid request body with all params', () => {
      const params = {
        destinationAddress: ['111', '222', '333'],
        message: 'test message {code}',
        length: 10,
        type: 'alphanumeric',
        expiry: 480,
        method: 'email'
      }

      const expectedBody = {
        code: {
          address: ['111', '222', '333'],
          message: 'test message {code}',
          format: {
            length: 10,
            type: 'alphanumeric'
          },
          expiry: 480,
          method: 'email'
        }
      }

      twofactor.sendCode(params).then((response) => {
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })

    it('converts expiry and length to integer when passed as string', () => {
      const params = {
        destinationAddress: [ '111', '222', '333' ],
        message: 'test message {code}',
        length: '10',
        expiry: '480'
      }

      const expectedBody = {
        code: {
          address: [ '111', '222', '333' ],
          message: 'test message {code}',
          format: {
            length: 10,
            type: 'numeric'
          },
          expiry: 480,
          method: 'sms'
        }
      }

      twofactor.sendCode(params).then((response) => {
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('twofactor.verifyCode', () => {
    it('generates valid url and request body', () => {
      const codeId = 'test-code-id'
      const params = {
        codeId,
        verificationCode: '123'
      }

      const expectedBody = {
        code: {
          verify: '123'
        }
      }

      const url = `${baseUrl}/${api.userId}/codes/${codeId}/verify`

      mocker({ url, method: 'PUT' })

      twofactor.verifyCode(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('twofactor.resendCode', () => {
    const codeId = 'test-code-id'
    const url = `${baseUrl}/${api.userId}/codes/${codeId}`

    beforeEach(() => {
      mocker({
        url,
        method: 'PUT',
        customBody: {
          code: {
            resourceURL: '/cpaas/auth/v1/91fc8907-d336-4707-ad3c-0711c0b87471/codes/51b545e7-729f-4690-9571-e5c85852b179'
          }
        },
        merge: true
      })
    })

    it('generates valid url and valid request body with only required params', () => {
      const params = {
        codeId,
        destinationAddress: [ '111', '222', '333' ],
        message: 'test message {code}'
      }

      const expectedBody = {
        code: {
          address: [ '111', '222', '333' ],
          message: 'test message {code}',
          format: {
            length: 6,
            type: 'numeric'
          },
          expiry: 120,
          method: 'sms'
        }
      }

      twofactor.resendCode(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })

    it('valid request body when string is passed to destinationAddress', () => {
      const params = {
        codeId,
        destinationAddress: '111',
        message: 'test message {code}'
      }

      const expectedBody = {
        code: {
          address: [ '111' ],
          message: 'test message {code}',
          format: {
            length: 6,
            type: 'numeric'
          },
          expiry: 120,
          method: 'sms'
        }
      }

      twofactor.resendCode(params).then((response) => {
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })

    it('generates valid request body with all params', () => {
      const params = {
        codeId,
        destinationAddress: [ '111', '222', '333' ],
        message: 'test message {code}',
        length: 10,
        type: 'alphanumeric',
        expiry: 480,
        method: 'email'
      }

      const expectedBody = {
        code: {
          address: [ '111', '222', '333' ],
          message: 'test message {code}',
          format: {
            length: 10,
            type: 'alphanumeric'
          },
          expiry: 480,
          method: 'email'
        }
      }

      twofactor.resendCode(params).then((response) => {
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })

    it('converts expiry and length to integer when passed as string', () => {
      const params = {
        codeId,
        destinationAddress: [ '111', '222', '333' ],
        message: 'test message {code}',
        length: '10',
        expiry: '480'
      }

      const expectedBody = {
        code: {
          address: [ '111', '222', '333' ],
          message: 'test message {code}',
          format: {
            length: 10,
            type: 'numeric'
          },
          expiry: 480,
          method: 'sms'
        }
      }

      twofactor.resendCode(params).then((response) => {
        expect(response.__FOR_TEST__.requestBody).to.deep.equal(expectedBody)
      })
    })
  })

  describe('twofactor.deleteCode', () => {
    const codeId = 'test-code-id'
    const url = `${baseUrl}/${api.userId}/codes/${codeId}`

    it('generates valid url', () => {
      const params = {
        codeId
      }

      mocker({ url, method: 'DELETE' })

      twofactor.deleteCode(params).then((response) => {
        expect(response.__FOR_TEST__.url).to.equal(url)
      })
    })
  })
})

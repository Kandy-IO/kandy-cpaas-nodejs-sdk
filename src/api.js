const camelcaseKeys = require('camelcase-keys')
const jwtDecode = require('jwt-decode')
const request = require('axios')

const auth = require('./resources/auth')
const _package = require('./../package.json')
const RequestError = require('./Error')
const { parseResponse } = require('./utils')

class API {
  constructor ({ baseUrl, clientId, clientSecret, email, password } = {}) {
    this.req = request.create({
      baseUrl: baseUrl
    })

    this.baseUrl = baseUrl
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.clientCorrelator = `${clientId}-node`
    this.email = email
    this.password = password
    this.tokenParsed = null
    this.accessToken = null
    this.idToken = null
    this.idTokenParsed = null
    this.userId = null
  }

  isTokenExpired () {
    if (!this.tokenParsed) {
      return true
    }

    const { exp, iat } = this.tokenParsed
    const minBuffer = (exp - iat) / 2


    const expiresIn = exp - Math.ceil(new Date().getTime() / 1000) - minBuffer

    return expiresIn < 0
  }

  setToken (data) {
    if (!data || !data.access_token || !data.id_token) {
      this.tokenParsed = null
      this.accessToken = null
      this.idToken = null
      this.idTokenParsed = null
      this.userId = null
    } else {
      const { accessToken, idToken } = camelcaseKeys(data)

      this.accessToken = accessToken
      this.tokenParsed = camelcaseKeys(jwtDecode(accessToken))
      this.idToken = idToken
      this.idTokenParsed = camelcaseKeys(jwtDecode(idToken))
      this.userId = this.idTokenParsed.preferredUsername
    }
  }

  headers (requestHeaders) {
    const baseHeaders = {
      'Authorization': `Bearer ${this.accessToken}`,
      'X-Cpaas-Agent': `nodejs-sdk/${_package.version}`
    }

    return {
      ...baseHeaders,
      ...requestHeaders
    }
  }

  makeRequest (callback) {
    if (this.isTokenExpired()) {
      return auth(this).token().then(data => {
        this.setToken(data)

        return callback().then(parseResponse)
      })
    }

    return callback().then(parseResponse)
  }

  sendRequest (url, options = {}, verb = 'get') {
    // const requestOptions = {
    //   qs: options.query,
    //   form: options.form,
    //   body: options.body,
    //   headers: this.headers(options.headers)
    // }
    let requestOptions = {}

    // handle query string
    if (options.query) {
      requestOptions = {
        params: options.query
      }
    }
    // handle body
    if (options.body) {
      requestOptions = {
        ...requestOptions,
        ...options.body
      }
    }
    // handle formdata
    if (options.formdata) {
      requestOptions = new FormData()
      Object.keys(options.formData).forEach(key => {
        requestOptions.append(key, options.formData[key])
      })
    }

    let response = null

    switch (verb) {
      case 'get':
        response = this.req.get(url, requestOptions, { headers: this.headers(options.headers) })
        break
      case 'post':
        response = this.req.post(url, requestOptions, { headers: this.headers(options.headers) })
        break
      case 'put':
        response = this.req.put(url, requestOptions, { headers: this.headers(options.headers) })
        break
      case 'patch':
        response = this.req.patch(url, requestOptions, { headers: this.headers(options.headers) })
        break
      case 'delete':
        response = this.req.delete(url, requestOptions, { headers: this.headers(options.headers) })
        break
      default:
        throw new Error('Invalid verb')
    }

    return response.catch(e => {
      throw new RequestError(e)
    })
  }
}

module.exports = API

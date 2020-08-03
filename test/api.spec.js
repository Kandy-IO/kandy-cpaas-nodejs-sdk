/* eslint-disable no-unused-expressions */
const expect = require('chai').expect

const API = require('../src/api')
const _package = require('./../package.json')

beforeEach(() => {
  // resources()
})
describe('API', () => {
  describe('constructor', () => {
    it('successfully initializes when given valid params', () => {
      const validParams = {
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        baseUrl: 'https://nvs-cpaas-oauth.kandy.io'
      }

      const api = new API(validParams)

      expect(api.clientId).to.equal(validParams.clientId)
      expect(api.clientSecret).to.equal(validParams.clientSecret)
      expect(api.baseUrl).to.equal(validParams.baseUrl)
      expect(api.tokenParsed).to.equal(null)
      expect(api.accessToken).to.equal(null)
      expect(api.idToken).to.equal(null)
      expect(api.idTokenParsed).to.equal(null)
    })

    it('sets default baseUrl when not provided', () => {
      const baseUrl = 'https://oauth-cpaas.kandy.com'

      const validParams = {
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        baseUrl
      }

      const api = new API(validParams)

      expect(api.baseUrl).to.equal(baseUrl)
    })
  })

  describe('isTokenExpired', () => {
    const validParams = {
      clientId: 'clientId',
      clientSecret: 'clientSecret'
    }

    const api = new API(validParams)

    it('returns true if parsed token is not present', () => {
      const isTokenExpired = api.isTokenExpired()

      expect(isTokenExpired).to.be.true
    })

    it('returns true if parsed token is expired', () => {
      const parsedToken = {
        iat: (new Date().getTime() / 1000) - (6 * 60 * 60), // 6 hours
        exp: (new Date().getTime() / 1000) + (4 * 60 * 60) // 4 hours
      }
      api.tokenParsed = parsedToken

      const isTokenExpired = api.isTokenExpired()

      expect(isTokenExpired).to.be.true
    })

    it('returns false if parsed token is valid', () => {
      const parsedToken = {
        iat: (new Date().getTime() / 1000) - 2 * 60 * 60, // 2 hours
        exp: (new Date().getTime() / 1000) + (4 * 60 * 60) // 4 hours
      }
      api.tokenParsed = parsedToken

      const isTokenExpired = api.isTokenExpired()

      expect(isTokenExpired).to.be.false
    })
  })

  describe('setToken', () => {
    const validParams = {
      clientId: 'clientId',
      clientSecret: 'clientSecret'
    }

    const api = new API(validParams)

    it('successfully sets token with valid params', () => {
      const validParams = {
        access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ0bXM3Qm1VRzVCR1RJb3hxbVlNVUFEdFZKWm93WDdXQnYyS0tvUVVwUFJZIn0.eyJqdGkiOiJmZWNhZDZlYS1hOGM5LTQxY2YtOGRlYS1iOWU4MjkxZDE5MWIiLCJleHAiOjE1NjI4NzMwODcsIm5iZiI6MCwiaWF0IjoxNTYyODQ0Mjg3LCJpc3MiOiJodHRwczovL252cy1jcGFhcy1vYXV0aC5rYW5keS5pby9hdXRoL3JlYWxtcy9hdHQiLCJhdWQiOiJQUklWLWthbmR5Lmt3LnRlc3QuMDAuZXF2cy5UZXN0IFByb2plY3QgMTAxIiwic3ViIjoiMWE5NzE4MzEtOTY2Ny00ZjNmLWE4YmQtMDEzNjA0MGI3YmNhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiUFJJVi1rYW5keS5rdy50ZXN0LjAwLmVxdnMuVGVzdCBQcm9qZWN0IDEwMSIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImY0MjkyYzQ4LWI2NDAtNDBmMC1hNmY4LTRkYWMzODJiZjY2MiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOltdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsibG9jYWxpemF0aW9uIiwiYWRkcmVzc2Jvb2siLCJub3RpZmljYXRpb25jaGFubmVsIiwiYXV0aCIsIm5tcyIsImNoYXQiLCJ3ZWJzb2NrZXQiLCJ3ZWJydGNzaWduYWxpbmciLCJjbGlja3RvY2FsbCIsInByZXNlbmNlIiwic21zbWVzc2FnaW5nIiwiZGlyZWN0b3J5Il19LCJyZXNvdXJjZV9hY2Nlc3MiOnt9LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiY2xpZW50SWQiOiJQUklWLWthbmR5Lmt3LnRlc3QuMDAuZXF2cy5UZXN0IFByb2plY3QgMTAxIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJjbGllbnRIb3N0IjoiMTA2LjUxLjIzLjI1NCIsInNlcnZpY2VzLWlkZW50aXR5IjoiYmxvaGU2aXBwaHU2c2sycEBrYW5keS5rdy50ZXN0LjAwLmVxdnMuYXR0LmNvbSIsInJlYWxtIjoiYXR0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiUmExVGlpZVFyNlRlemoyZSIsImNsaWVudEFkZHJlc3MiOiIxMDYuNTEuMjMuMjU0IiwiZW1haWwiOiJzZXJ2aWNlLWFjY291bnQtcHJpdi1rYW5keS5rdy50ZXN0LjAwLmVxdnMudGVzdCBwcm9qZWN0IDEwMUBwbGFjZWhvbGRlci5vcmcifQ.SOEIVqmQKopev_o_px9ZqVqHhagE1BoWKDrb987-Ov8xO4OA8u8ghKmckHZvs959KDgwWHw2akwH_UjA8G--qKLxDZb40NxLFPLsnT6Z9ZAJnP_pq-i1T-PZ9BETySyrVIJ0RjqyOyPA-HTAPBKWtuDy9zAsQUA9eJOYZPQpUYBnirJjZPgRvZ-TtgpCS6PUUNBiiBXUsZHoTAKQ8rpEKLijAsDSqLt7eYcDhOp_Q7FnpUuTUwej5xSbLlyFT4GY1WAzfJxUZsG1VTXYZktH_4iIOwMpyXQ9cuXNVfUiawdX-3fB2Imq3dy4CEAqdY9zr54btjmpjuCUGFdWGms0LA',
        id_token: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ0bXM3Qm1VRzVCR1RJb3hxbVlNVUFEdFZKWm93WDdXQnYyS0tvUVVwUFJZIn0.eyJqdGkiOiI0YjU2MjgxNS1jMDE0LTQ2ZmUtYTAwMi0xMTg3NWQ3NzJiOTIiLCJleHAiOjE1NjI4NzMwODcsIm5iZiI6MCwiaWF0IjoxNTYyODQ0Mjg3LCJpc3MiOiJodHRwczovL252cy1jcGFhcy1vYXV0aC5rYW5keS5pby9hdXRoL3JlYWxtcy9hdHQiLCJhdWQiOiJQUklWLWthbmR5Lmt3LnRlc3QuMDAuZXF2cy5UZXN0IFByb2plY3QgMTAxIiwic3ViIjoiMWE5NzE4MzEtOTY2Ny00ZjNmLWE4YmQtMDEzNjA0MGI3YmNhIiwidHlwIjoiSUQiLCJhenAiOiJQUklWLWthbmR5Lmt3LnRlc3QuMDAuZXF2cy5UZXN0IFByb2plY3QgMTAxIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiZjQyOTJjNDgtYjY0MC00MGYwLWE2ZjgtNGRhYzM4MmJmNjYyIiwiYWNyIjoiMSIsImNsaWVudElkIjoiUFJJVi1rYW5keS5rdy50ZXN0LjAwLmVxdnMuVGVzdCBQcm9qZWN0IDEwMSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SG9zdCI6IjEwNi41MS4yMy4yNTQiLCJzZXJ2aWNlcy1pZGVudGl0eSI6ImJsb2hlNmlwcGh1NnNrMnBAa2FuZHkua3cudGVzdC4wMC5lcXZzLmF0dC5jb20iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJSYTFUaWllUXI2VGV6ajJlIiwiY2xpZW50QWRkcmVzcyI6IjEwNi41MS4yMy4yNTQiLCJlbWFpbCI6InNlcnZpY2UtYWNjb3VudC1wcml2LWthbmR5Lmt3LnRlc3QuMDAuZXF2cy50ZXN0IHByb2plY3QgMTAxQHBsYWNlaG9sZGVyLm9yZyJ9.VmBpr7uf0qoTy4y7Z4NQzPaM-_wU3KrgbVZG4PgPHVR8xAq-U-wh-PpOEJGW7ltJWTOedCd2fzY7FHH1QlqI1nynBwzKYWg9bw0WHlfZ3ediQ1Uu-IKnnZeamP9mSh6SFDPd49aMarep4r8DEKy7W7KfSpCNfllPru0LE7AAdpE750hy6gNjO2vnPfiytPuhU6gGf6xuOituTusG4KYPywFdlHLSADXyFN_BSfUTRoSWteTKV3MdJibkhj6gJQhnlhqbqf9YxjN-ifCVtJeagvCKs23EGK980WAnNp_g8p0etDGGUeVr7TrUSmhjf__FwSB9AGXabOT116jR3Zx-FA'
      }

      api.setToken(validParams)

      expect(api.accessToken).to.not.be.null
      expect(api.tokenParsed).to.not.be.null
      expect(api.idToken).to.not.be.null
      expect(api.idTokenParsed).to.not.be.null
    })

    it('successfully decodes tokens with valid params', () => {
      const validParams = {
        access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ0bXM3Qm1VRzVCR1RJb3hxbVlNVUFEdFZKWm93WDdXQnYyS0tvUVVwUFJZIn0.eyJqdGkiOiJmZWNhZDZlYS1hOGM5LTQxY2YtOGRlYS1iOWU4MjkxZDE5MWIiLCJleHAiOjE1NjI4NzMwODcsIm5iZiI6MCwiaWF0IjoxNTYyODQ0Mjg3LCJpc3MiOiJodHRwczovL252cy1jcGFhcy1vYXV0aC5rYW5keS5pby9hdXRoL3JlYWxtcy9hdHQiLCJhdWQiOiJQUklWLWthbmR5Lmt3LnRlc3QuMDAuZXF2cy5UZXN0IFByb2plY3QgMTAxIiwic3ViIjoiMWE5NzE4MzEtOTY2Ny00ZjNmLWE4YmQtMDEzNjA0MGI3YmNhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiUFJJVi1rYW5keS5rdy50ZXN0LjAwLmVxdnMuVGVzdCBQcm9qZWN0IDEwMSIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImY0MjkyYzQ4LWI2NDAtNDBmMC1hNmY4LTRkYWMzODJiZjY2MiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOltdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsibG9jYWxpemF0aW9uIiwiYWRkcmVzc2Jvb2siLCJub3RpZmljYXRpb25jaGFubmVsIiwiYXV0aCIsIm5tcyIsImNoYXQiLCJ3ZWJzb2NrZXQiLCJ3ZWJydGNzaWduYWxpbmciLCJjbGlja3RvY2FsbCIsInByZXNlbmNlIiwic21zbWVzc2FnaW5nIiwiZGlyZWN0b3J5Il19LCJyZXNvdXJjZV9hY2Nlc3MiOnt9LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiY2xpZW50SWQiOiJQUklWLWthbmR5Lmt3LnRlc3QuMDAuZXF2cy5UZXN0IFByb2plY3QgMTAxIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJjbGllbnRIb3N0IjoiMTA2LjUxLjIzLjI1NCIsInNlcnZpY2VzLWlkZW50aXR5IjoiYmxvaGU2aXBwaHU2c2sycEBrYW5keS5rdy50ZXN0LjAwLmVxdnMuYXR0LmNvbSIsInJlYWxtIjoiYXR0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiUmExVGlpZVFyNlRlemoyZSIsImNsaWVudEFkZHJlc3MiOiIxMDYuNTEuMjMuMjU0IiwiZW1haWwiOiJzZXJ2aWNlLWFjY291bnQtcHJpdi1rYW5keS5rdy50ZXN0LjAwLmVxdnMudGVzdCBwcm9qZWN0IDEwMUBwbGFjZWhvbGRlci5vcmcifQ.SOEIVqmQKopev_o_px9ZqVqHhagE1BoWKDrb987-Ov8xO4OA8u8ghKmckHZvs959KDgwWHw2akwH_UjA8G--qKLxDZb40NxLFPLsnT6Z9ZAJnP_pq-i1T-PZ9BETySyrVIJ0RjqyOyPA-HTAPBKWtuDy9zAsQUA9eJOYZPQpUYBnirJjZPgRvZ-TtgpCS6PUUNBiiBXUsZHoTAKQ8rpEKLijAsDSqLt7eYcDhOp_Q7FnpUuTUwej5xSbLlyFT4GY1WAzfJxUZsG1VTXYZktH_4iIOwMpyXQ9cuXNVfUiawdX-3fB2Imq3dy4CEAqdY9zr54btjmpjuCUGFdWGms0LA',
        id_token: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ0bXM3Qm1VRzVCR1RJb3hxbVlNVUFEdFZKWm93WDdXQnYyS0tvUVVwUFJZIn0.eyJqdGkiOiI0YjU2MjgxNS1jMDE0LTQ2ZmUtYTAwMi0xMTg3NWQ3NzJiOTIiLCJleHAiOjE1NjI4NzMwODcsIm5iZiI6MCwiaWF0IjoxNTYyODQ0Mjg3LCJpc3MiOiJodHRwczovL252cy1jcGFhcy1vYXV0aC5rYW5keS5pby9hdXRoL3JlYWxtcy9hdHQiLCJhdWQiOiJQUklWLWthbmR5Lmt3LnRlc3QuMDAuZXF2cy5UZXN0IFByb2plY3QgMTAxIiwic3ViIjoiMWE5NzE4MzEtOTY2Ny00ZjNmLWE4YmQtMDEzNjA0MGI3YmNhIiwidHlwIjoiSUQiLCJhenAiOiJQUklWLWthbmR5Lmt3LnRlc3QuMDAuZXF2cy5UZXN0IFByb2plY3QgMTAxIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiZjQyOTJjNDgtYjY0MC00MGYwLWE2ZjgtNGRhYzM4MmJmNjYyIiwiYWNyIjoiMSIsImNsaWVudElkIjoiUFJJVi1rYW5keS5rdy50ZXN0LjAwLmVxdnMuVGVzdCBQcm9qZWN0IDEwMSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SG9zdCI6IjEwNi41MS4yMy4yNTQiLCJzZXJ2aWNlcy1pZGVudGl0eSI6ImJsb2hlNmlwcGh1NnNrMnBAa2FuZHkua3cudGVzdC4wMC5lcXZzLmF0dC5jb20iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJSYTFUaWllUXI2VGV6ajJlIiwiY2xpZW50QWRkcmVzcyI6IjEwNi41MS4yMy4yNTQiLCJlbWFpbCI6InNlcnZpY2UtYWNjb3VudC1wcml2LWthbmR5Lmt3LnRlc3QuMDAuZXF2cy50ZXN0IHByb2plY3QgMTAxQHBsYWNlaG9sZGVyLm9yZyJ9.VmBpr7uf0qoTy4y7Z4NQzPaM-_wU3KrgbVZG4PgPHVR8xAq-U-wh-PpOEJGW7ltJWTOedCd2fzY7FHH1QlqI1nynBwzKYWg9bw0WHlfZ3ediQ1Uu-IKnnZeamP9mSh6SFDPd49aMarep4r8DEKy7W7KfSpCNfllPru0LE7AAdpE750hy6gNjO2vnPfiytPuhU6gGf6xuOituTusG4KYPywFdlHLSADXyFN_BSfUTRoSWteTKV3MdJibkhj6gJQhnlhqbqf9YxjN-ifCVtJeagvCKs23EGK980WAnNp_g8p0etDGGUeVr7TrUSmhjf__FwSB9AGXabOT116jR3Zx-FA'
      }

      api.setToken(validParams)

      expect(api.tokenParsed).to.be.an('object')
      expect(api.idTokenParsed).to.be.an('object')
      expect(api.userId).to.be.an('string')
    })

    it('sets null when with empty params', () => {
      api.setToken({})

      expect(api.accessToken).to.be.null
      expect(api.tokenParsed).to.be.null
      expect(api.idToken).to.be.null
      expect(api.idTokenParsed).to.be.null
      expect(api.idTokenParsed).to.be.null
    })
  })

  describe('headers', () => {
    const validParams = {
      clientId: 'clientId',
      clientSecret: 'clientSecret'
    }

    const api = new API(validParams)

    it('returns default headers when no params are passed', () => {
      const headers = api.headers()
      expect(headers).to.be.an('object')
      expect(headers).to.have.keys([ 'Authorization', 'X-Cpaas-Agent', 'Content-Type' ])
      expect(headers['X-Cpaas-Agent']).to.eq(`nodejs-sdk/${_package.version}`)
    })

    it('returns appended headers with valid params', () => {
      const requestHeaders = {
        'age': 600
      }

      const headers = api.headers(requestHeaders)

      expect(headers).to.be.an('object')
      expect(headers).to.have.all.keys([ 'Authorization', 'age', 'X-Cpaas-Agent', 'Content-Type' ])
    })
  })
})

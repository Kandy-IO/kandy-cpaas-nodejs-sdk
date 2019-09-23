const API = require('./api')
const resources = require('./resources')

class Client {
  constructor (config = {}) {
    const { clientId, clientSecret, email, password } = config

    if (!clientId) {
      throw new Error('`clientId` is mandatory')
    }

    if (!(clientSecret || (email && password))) {
      throw new Error('`clientSecret` or `email/password` is mandatory')
    }

    this.api = new API(config)

    this.addResources()
  }

  addResources () {
    Object.assign(this, resources(this.api))
  }
}

module.exports = Client

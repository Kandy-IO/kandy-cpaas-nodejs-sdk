// const addressbook = require('./resources/addressbook')
// const auth = require('./resources/auth')
// const call = require('./resources/call')
// const directory = require('./resources/directory')
// const notificationChannel = require('./resources/notificationChannel')
// const presence = require('./resources/presence')
// const userManagement = require('./resources/userManagement')
const conversation = require('./resources/conversation')
const notification = require('./resources/notification')
const twofactor = require('./resources/twofactor')

module.exports = function resources (api) {
  return {
    // addressbook: addressbook(api),
    // auth: auth(api),
    // call: call(api),
    // directory: directory(api),
    // notificationChannel: notificationChannel(api),
    // presence: presence(api),
    // userManagement: userManagement(api),
    conversation: conversation(api),
    notification: notification(api),
    twofactor: twofactor(api)
  }
}

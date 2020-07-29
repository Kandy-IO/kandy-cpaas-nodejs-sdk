const dotenv = require('dotenv')
const express = require('express')
const path = require('path')
const { createClient } = require('@kandy-io/cpaas-nodejs-sdk')

dotenv.config()

const server = express()
const port = process.env.PORT || '8000'

setDefaultState()

// Initialize client
const client = createClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  baseUrl: process.env.BASE_URL
})

server.use(express.static(path.join(__dirname, '/public')))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.set('view engine', 'ejs')

server.get('/', (req, res) => {
  const type = req.query.success ? 'success' : 'error'
  const message = req.query[type]

  res.render('pages/index', { alert: { message, type } })
})

server.post('/send', async (req, res) => {
  try {
    const response = await client.conversation.createMessage({
      destinationAddress: req.body.number,
      message: req.body.message,
      senderAddress: process.env.PHONE_NUMBER
    })

    res.redirect(302, '/?success=Success')
  } catch (error) {
    // Received error message is echoed back to the UI as an error alert.
    res.redirect(302, `/?error=${errorMessageFrom(error)}`)
  }
})

server.post('/subscribe', async (req, res) => {
  try {
    const response = await client.conversation.subscribe({
      destinationAddress: process.env.PHONE_NUMBER,
      webhookURL: `${req.body.webhook}/webhook`
    })

    res.redirect(302, `/?success=Created subscription`)
  } catch (error) {
    // Received error message is echoed back to the UI as an error alert.
    res.redirect(302, `/?error=${errorMessageFrom(error)}`)
  }
})

server.post('/webhook', (req, _res) => {
  const notification = client.notification.parse(req.body)

  setNotification(notification)
})

server.get('/notifications', (_req, res) => {
  res.send(getNotifications())
})

server.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`)
})

/**
 * Helper methods
 */

function setDefaultState () {
  server.set('notifications', [])
}

function getNotifications () {
  return server.get('notifications')
}

function setNotification (notification) {
  const notifications = getNotifications()

  notifications.unshift(notification)

  server.set('notifications', notifications)
}

function errorMessageFrom (error) {
  const { message, name, exceptionId } = error

  return `${name}: ${message} (${exceptionId})`
}

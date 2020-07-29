const dotenv = require('dotenv')
const express = require('express')
const path = require('path')
const { createClient } = require('@kandy-io/cpaas-nodejs-sdk')
const { validCredentials } = require('./utils')

dotenv.config()

const server = express()
const port = process.env.PORT || '8000'

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

server.route('/login')
  .get((_req, res) => {
    if (isLoggedIn()) {
      // If user is logged in and trying to access login page, redirect to dashboard.
      return res.redirect('/dashboard')
    }

    setDefaultState()

    res.render('pages/login')
  })
  .post(async (req, res) => {
    if (!validCredentials(req.body)) {
      // If login credentials do not match with credentials present in .env, login page is re-rendered with error alert.
      return res.render('pages/login', { alert: { message: 'Invalid username or password', type: 'error' } })
    }

    /**
    * If login credentials are valid, redirected to verify page.
    *
    */
    setCredentialsVerified()
    res.redirect('/verify')
  })

server.route('/sendtwofactor')
  .post(async (req, res) => {
    try {
      if (req.body.otp == 'email') {
        var response = await client.twofactor.sendCode({
          destinationAddress: process.env.DESTINATION_EMAIL,
          message: 'Your verification code {code}',
          subject: 'Twofactor verification',
          method: 'email',
        })
      } else if (req.body.otp == 'sms') {
        var response = await client.twofactor.sendCode({
          destinationAddress: process.env.PHONE_NUMBER,
          message: 'Your verification code {code}'
        })
      }

      setCodeId(response.codeId)
      res.render('pages/verify', { alert: { message: 'Twofactor verification code sent successfully', type: 'success'}})
    } catch (error) {
      const { message, name, exceptionId } = error
      const errorMessage = `${name}: ${message} (${exceptionId})`
      res.render('pages/verify', { alert: { message: errorMessage, type: 'error' } })
    }
  })

server.route('/verify')
  .get(async (_req, res) => {
    if (isLoggedIn()) {
      // If logged in and trying to access login page, redirect to dashboard.
      return res.redirect('/dashboard')
    } else if (!credentialVerified()) {
      // If login credentials are not verified but tries to access the code verification page, user redirected.
      return res.redirect('/logout')
    }

    // If the login credentials are verified, user is redirected to code verification page.
    res.render('pages/verify')
  })
  .post(async (req, res) => {
    /**
     * The 2FA code entered in the UI is passed to the verifyCode along with codeId,
     * which was saved from the response of sendCode method.
     *
     * There are two valid response for verifyCode method.
     *
     * Type 1 - The 2FA code is successfully verified.
     * {
     *  verified: true,
     *  message: 'Verified'
     * }
     *
     * Type 2 - The 2FA code pass is either incorrect or the code has expired
     * (The expiry of the code can be changed by passing expiry param in the sendCode. Ref - Documentation)
     * {
     *  verified: false,
     *  message: 'Code expired or invalid'
     * }
     *
     */
    try {
      const response = await client.twofactor.verifyCode({
        codeId: codeId(), // codeId() fetches saved codeId from the server instance. Check 'Helper methods' below for reference.
        verificationCode: req.body.code
      })

      if (response.verified) {
        login()
        // The code is verified and redirected to dashboard/portal/protected area of app.
        res.redirect('/dashboard')
      } else {
        // The code is invalid and error message received from server is shown as error alert.
        res.render('pages/verify', { alert: { message: response.message, type: 'error' } })
      }
    } catch (error) {
      // Here something went wrong either the server or proper parameters were not passed.
      const { message, name, exceptionId } = error
      const errorMessage = `${name}: ${message} (${exceptionId})`

      // Received error message is echoed back to the UI as error alert.
      res.redirect('/verify', { alert: { message: errorMessage, type: 'error' } })
    }
  })

server.route('/dashboard')
  .get((_req, res) => {
    if (!isLoggedIn()) {
      // If not logged in, redirected to logout.
      return res.redirect('/logout')
    }

    // Login criteria is fulfilled, renders dashboard/portal/protected area of app
    res.render('pages/dashboard')
  })

server.route('/logout')
  .get((_req, res) => {
    // Login data is cleared
    logout()
    res.redirect('/login')
  })

server.get('/', (_req, res) => {
  res.redirect('/login')
})

server.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`)
})

/**
  Helper methods
*/

const isLoggedIn = () => {
  return server.get('credentialsVerified') && server.get('codeVerified')
}

const credentialVerified = () => {
  return server.get('credentialsVerified') && !server.get('codeVerified')
}

const logout = () => {
  setDefaultState()
}

const setDefaultState = () => {
  server.set('credentialsVerified', false)
  server.set('codeVerified', false)
}

const setCredentialsVerified = () => {
  server.set('credentialsVerified', true)
  server.set('codeVerified', false)
}

const login = () => {
  server.set('credentialsVerified', true)
  server.set('codeVerified', true)
}

const setCodeId = (codeId) => {
  server.set('codeId', codeId)
}

const codeId = () => {
  return server.get('codeId')
}

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
    * If login credentials are valid, sendCode method is used to request 2FA code
    * to the phone number as destinationAddress.
    *
    * If a valid response is received, the codeId present in the response is set in the server instance.
    * This codeId is eventually used when the 2FA code (received in the phone number) needs to be verified.
    * Once the codeId is set, the user is redirected to the code verification page
    * where the user is prompted to enter the code received in the phone number.
    *
    * If an error is raised by sendCode, it is caught in the catch block and the user is
    * redirected to the login page with the received error message as an alert.
    *
    */

    try {
      const response = await client.twofactor.sendCode({
        destinationAddress: process.env.PHONE_NUMBER,
        message: 'Your verification code {code}'
      })

      console.log(response)

      setCodeId(response.codeId)

      setCredentialsVerified()

      res.redirect('/verify')
    } catch (error) {
      // Here something went wrong either the server or proper parameters were not passed.
      const { message, name, exceptionId } = error
      const errorMessage = `${name}: ${message} (${exceptionId})`

      // Received error message is echoed back to the UI as error alert.
      res.render('pages/login', { alert: { message: errorMessage, type: 'error' } })
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
    res.render('pages/verify', { alert: { message: 'Verification code has been sent to your phone number', type: 'success' } })
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

      console.log(response)

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

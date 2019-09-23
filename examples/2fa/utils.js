const validCredentials = ({ email, password }) => {
  if (!email || !password) { return false }

  return email === process.env.EMAIL && password === process.env.PASSWORD
}

module.exports = {
  validCredentials
}

/* globals localStorage */
const OktaAuth = require('@okta/okta-auth-js')
const authClient = new OktaAuth({url: 'https://dev-465261.oktapreview.com', issuer: 'default'})

export default {
  login (email, pass, cb) {
    cb = arguments[arguments.length - 1]
    if (localStorage.token) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }
    return authClient.signIn({
      username: email,
      password: pass
    }).then(response => {
      if (response.status === 'SUCCESS') {
        localStorage.token = response.sessionToken
        localStorage.email = response.user.profile.login
        if (cb) cb(true)
        this.onChange(true)
      }
    }).fail(err => {
      console.error(err.message)
      if (cb) cb(false)
      this.onChange(false)
    })
  },

  getToken () {
    return localStorage.token
  },

  logout (cb) {
    delete localStorage.token
    delete localStorage.email
    if (cb) cb()
    this.onChange(false)
    return authClient.signOut()
  },

  loggedIn () {
    return !!localStorage.token
  },

  onChange () {
  }
}

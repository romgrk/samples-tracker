global.Promise = require('bluebird')
const path = require('path')
const express = require('express')
const session = require('express-session')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const flash = require('connect-flash')

const config = require('./config.js')
const passport = require('./passport.js')
const users = require('./routes/users')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Passport setup
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()) // use connect-flash for flash messages stored in session


app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile.ejs', {
    user: req.user // get the user out of session and pass to template
  })
})
app.get('/login', (req, res) => {
  // render the page and pass in any flash data if it exists
  res.render('login.ejs', { message: req.flash('loginMessage') })
})
// process the login form
// app.post('/login', do all our passport stuff here);)

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.use('/users', users)



// Google OAuth
app.get('/auth/google', passport.authenticate('google', {
  scope : ['profile', 'email'],
  callbackURL: config.google.callbackURL,
}))
app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect : '/profile',
  failureRedirect : '/',
}))

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next()
  res.redirect('/')
}


app.use('/', (req, res) => res.render('index.ejs'))

// 404 Handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error   = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})


module.exports = app

var fs = require('fs')
var https = require('https')
var path = require('path')

var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')

var passport = require('passport')
var passportLocal = require('passport-local')
var passportHttp = require('passport-http')

var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/passport-demo')

var User = require('./models/user')
var Location = require('./models/location')

var app = express()

var server = https.createServer({
	cert: fs.readFileSync( __dirname + '/my.crt' ),
	key:  fs.readFileSync( __dirname + '/my.key' )
}, app)

app.engine('hbs', exphbs({ defaultLayout: 'main.hbs' }))
app.set('view engine', 'hbs')

// cookieParse, expressSession + passport.session
// only required for local cookie based auth
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(expressSession({
	secret: process.env.SESSION_SECRET || 'secret',
	resave: false,
	saveUninitialized: false
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new passportLocal.Strategy(verifyCredentials))
passport.use(new passportHttp.BasicStrategy(verifyCredentials))

function verifyCredentials (username, password, done) {
	User.find({ username:username, password:password }, function (err, user) {
		if (err) done(err)

		if (user.length > 0) done(null, user[0])
		else done(null, null)
	})
}

passport.serializeUser(function (user, done) {
	done(null, user._id)
})

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		if (err) done(err)

		if (user) done(null, { id: user.id, username: user.username, name: user.name })
		else done(null, null)
	})
})

function ensureAuthenticated (req, res, next) {
	if (req.isAuthenticated()) {
		next()
	} else {
		res.send(403)
	}
}

app.get('/', function (req, res) {
	res.render('index', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	})
})

app.get('/login', function (req, res) {
	res.render('login')
})

app.post('/login', passport.authenticate('local'), function (req, res) {
	res.redirect('/')
})

app.get('/logout', function (req, res) {
	req.logout() // this method added by passport
	res.redirect('/')
})

// Use basic http auth for all /api/** requests
app.use('/api', passport.authenticate('basic', { session: false }))

app.get('/api/locations', ensureAuthenticated, function (req, res) {
	Location.find(function (err, locations) {
		if (err) res.send( err )
		res.json( locations )
	})
})

app.get('/api/users', ensureAuthenticated, function (req, res) {
	User.find(function (err, users) {
		if (err) res.send( err )
		res.json( users )
	})
})

var port = process.env.PORT || 1337
// with https use server.listen (instead of app.listen)
// the req will then be passed to express
server.listen(port, function () {
	console.log('http://127.0.0.1:' + port + '/')
})

// generate a development cert for local SSL testing
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key

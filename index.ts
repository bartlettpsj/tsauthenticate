import express = require('express');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash')
const session = require('express-session')

const app: express.Express = express();

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}))

passport.use(new LocalStrategy({usernameField: 'name'},
    function (username, password, done) {
        console.log('Authenticating')

        if (username === 'a@a' && password === 'a') {
            return done(null, {name: 'paul', age: 21});
        } else {
            return done(null, false, {message: 'Incorrect username.'});
        }
    }
));

app.use(passport.initialize())
app.use(passport.session());

app.get('/login', (req, res, next) => res.render('login.ejs'))

app.get('/hello', (req, res, next) => {
    res.send('Hello')
})

app.get('/failed', (req, res, next) => {
    res.send('Failed')
})

app.get('/', (req, res, next) => res.render('home.ejs', {name: 'Paul Bartlett'}))

app.post('/login',
    passport.authenticate('local',
        {
            successRedirect: '/hello',
            failureRedirect: '/failed',
            failWithError: true,
            session: false
        }),
    (req, res, next) => {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.send('authgenticated');
        // res.redirect('/users/' + req.user.username);
    });

app.listen(3000, () => console.log(`Example app listening on port 3000`));
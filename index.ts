import * as express from 'express'
import * as passport from 'passport';
import flash = require('express-flash');
import session = require('express-session');
import Users, { User } from './Users'
import {Strategy as LocalStrategy} from "passport-local";

const app: express.Express = express();

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: 'mynotverysecret',
    resave: false,
    saveUninitialized: false
}))

passport.use(new LocalStrategy({usernameField: 'name'},
    function (username, password, done) {
        console.log('Authenticating')

        if (username === 'a@a' && password === 'a') {
            return done(null, {id: 1, name: 'paul', age: 21});
        } else {
            return done(null, false, {message: 'Incorrect username.'});
        }
    }
));

passport.serializeUser<User, number>((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => done(null, Users.getUserById(id)))

app.use(passport.initialize())
app.use(passport.session());

// Check authenticated and redirect to logon.  Check not authenticated and if already redirect home
const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')
const checkNotAuthenticated = (req, res, next) => !req.isAuthenticated() ? next() : res.redirect('/')

// Routes with 404 at the end
app.get('/login', checkNotAuthenticated, (req, res, next) => res.render('login.ejs'))
app.get('/hello', checkAuthenticated, (req, res, next) => res.render('hello.ejs'))
app.get('/logout', checkAuthenticated, (req, res, next) => res.render('logout.ejs'))
app.get('/failed', (req, res, next) => res.send('Failed'))
app.get('/', checkAuthenticated, (req, res, next) => res.render('home.ejs', {name: 'Paul Bartlett'}))

app.post('/login',
    passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/failed',
            failWithError: true,
            session: true
        }),
    (req, res, next) => {
        // If this function gets called, authentication was successful. But we need a next() to get here
        res.send('authenticated route :-)');
    });

app.post('/logout', (req, res, next) => {
    req.logOut()
    res.redirect('/login')
})

app.get('*', (req, res, next) => res.render('404.ejs'))

app.listen(3000, () => console.log(`Example app listening on port 3000`))
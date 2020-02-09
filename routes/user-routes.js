var db = require("../models");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Passport Local Strategy
passport.use(new LocalStrategy(
    function (username, password, done) {
        db.User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));


module.exports = function (app) {
    // show login page
    app.get('/login', (req, res) => {
        res.render(
            "index", { login: true }
        )
    })

    // validate user login and redirect to profile
    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/db/saved', // redirect to user profile / custom feed on successful login
            failureRedirect: '/'
        })
    );

};
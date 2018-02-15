const User = require('../models/users.models');
const LocalStrategy = require('passport-local').Strategy;

module.exports.setup = (passport) => {

    passport.serializeUser((user, next) => {
        next(null, user._id);
    });

    passport.deserializeUser((id, next) => {
        User.findById(id)
            .then(user => {
                next(null, user);
            })
            .catch(error => next(error));
    });

    passport.use('local-auth', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, next) => {
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    next(null, user, { password: 'Invalid email or password' });
                } else {
                    user.checkPassword(password)
                        .then(match => {
                            if (match) {
                                next(null, user);
                            } else {
                                next(null, null, { password: 'Invalid email or password' });
                            }
                        })
                        .catch(error => next(error));
                }
            })
            .catch(error => next(error));
    }));

}

module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(401);
        res.redirect('/login');
    }
}

module.exports.nonAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/');
    }
}
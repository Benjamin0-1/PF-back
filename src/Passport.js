// AQUI VA LA CONFIGURACION PARA LOGIN DE TERCEROS UTILIZANDO GOOGLE.
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

const app = express();

const GOOGLE_CLIENT_ID = ''
const GOOGLE_CLIENT_SECRET = ''
const CALLBACK_URL = ''


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
        const existingUser = await User.findOne({google_id: profile.id}); // also include gmail email.
        if (existingUser) {
            return done(null, existingUser)
        };

        const newUser = await User.create({
            google_id: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            // edad no es entregada.
        });

        return done(null, newUser)

    } catch (error) {
        return (error, null)
    }
  }
));

app.use(passport.initialize());

app.get('/failed/login', (req, res) => {
    res.send('Failed Login')
});

app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));;

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed/login' }), (req, res) => {
    // Redirect the user to the appropriate page after successful authentication
    res.redirect('/failed/login');
});


module.exports = passportGoogleStrategy;

/* 

MIDDLEWARE ACTUALIZADO PARA QUE FUNCIONA CON AMBOS TIPOS DE USUARIOS.
function isAuthenticated(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token from request headers

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, 'access-secret', async (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: 'Invalid access token.' });
        }

        if (decoded.userId) { // Handle local user authentication
            try {
                const user = await User.findByPk(decoded.userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }
                req.user = user;
                next();
            } catch (error) {
                console.error('Error fetching user data:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        } else if (decoded.googleId) { // Handle Google user authentication
            try {
                const user = await User.findOne({ where: { google_id: decoded.googleId } });
                if (!user) {
                    return res.status(404).json({ message: 'Google user not found.' });
                }
                req.user = user;
                next();
            } catch (error) {
                console.error('Error fetching Google user data:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        } else {
            return res.status(401).json({ message: 'Invalid token format.' });
        }
    });
}

*/


// AQUI VA LA CONFIGURACION PARA LOGIN DE TERCEROS UTILIZANDO GOOGLE.
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const jwt = require('jsonwebtoken');


const app = express();
const router = express.Router();
router.use(passport.initialize());

const GOOGLE_CLIENT_ID = '926697330995-00o61f7imftqa9skmqhiflo7qhgej52m.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'
const CALLBACK_URL = 'http://localhost:3000/home';

// en caso de olvidarlo, si el usuario esta loggeado puede volver a verlo
router.get('/passport/secret/get-secret', isAuthenticated, async(req, res) => {
    const userId = req.user.userId;

    try {
        
        const userSecret = await User.findOne({
            where: {
                userId,
                otp_secret
            }
        });

        if (!userSecret) {
            return res.status(404).json({message: "You haven't yet generated your secret", secretNotFound: true})
        };

        res.json(userSecret)

    } catch (error) {
        res.status(500).json(`Internal Server Error: ${error}`)
    }
});


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) { 
    try {
        const existingUser = await User.findOne({where: {id: profile.id}}); // also include gmail email.
        const checkEmailExists = await User.findOne({where: {email: profile.emails[0].value}});
        if (checkEmailExists) {
            return done(null, checkEmailExists)
        };
       
        // username creation will have deep logic in place so that it doesn't choose an already in use one inside the Users table.

        if (existingUser) {
            return done(null, existingUser)
        };

        const newUser = await User.create({
            id: profile.id + 1000, // <-- google users empiezan en id mil.
            username: generateUniqueUsername(), // <-- make sure it does not collide with existing usernames in the Users table.
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            // edad no es entregada.
        });

        return done(null, newUser)

    } catch (error) {
        return done(error, null);

    }
  }
));

async function generateUniqueUsername(profile) {
    try {
        const allCurrentUsernames = await User.findAll({ attributes: ['username'] });
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        let baseUsername = firstName.toLowerCase() + lastName.toLowerCase();
        let count = 1;
        let uniqueUsername = baseUsername;
        while (allCurrentUsernames.includes(uniqueUsername)) {
            uniqueUsername = baseUsername + generateRandomString(getRandomInt(1, 50));
            count++;
        }
        return uniqueUsername;
    } catch (error) {
        console.error('Error generating unique username:', error);
        throw error;
    }
}

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    return randomString;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAccessToken(user) {
    return jwt.sign({ userId: user.id, username: user.username }, 'access-secret', { expiresIn: '50m' });
}

function generateRefreshToken(user) {
    return jwt.sign({ userId: user.id, username: user.username }, 'refresh-secret', { expiresIn: '15d' });
}

function isAuthenticated(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, 'access-secret', (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: 'Invalid access token.' });
        }
        req.user = decoded;
        next();
    });
}



router.get('/failed/login', (req, res) => {
    res.send('Failed Login');
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }), (req, res) => {
    // successRedirect
    res.redirect('http://localhost:3001/home');
});

module.exports = router;


/*



// < ===== PASSPORT

const GOOGLE_CLIENT_ID = '926697330995-00o61f7imftqa9skmqhiflo7qhgej52m.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'
const CALLBACK_URL = 'http://localhost:3000';

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) { 
    try {
        const existingUser = await User.findOne({where: {id: profile.id}}); // also include gmail email.
        const checkEmailExists = await User.findOne({where: {email: profile.emails[0].value}});
        if (checkEmailExists) {
            return done(null, checkEmailExists)
        };
       
        // username creation will have deep logic in place so that it doesn't choose an already in use one inside the Users table.

        if (existingUser) {
            return done(null, existingUser)
        };

        const newUser = await User.create({
            id: profile.id + 1000,
            username: generateUniqueUsername(profile),
            email: profile.emails[0].value,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            password: await bcrypt.hash(generateRandomPassword(), 10), // Generate and hash a random password
        });
    
        

        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken();
       // return done(null, newUser, accessToken);
       console.log(`Access Token: ${accessToken} REFRESH TOKEN: ${refreshToken}`);
   //    return done(null, user, refreshToken)
       return done(null, {user: newUser, accessToken: accessToken, refreshToken: refreshToken});


    } catch (error) {
        return done(error, null);

    }
  }
));

// random passwd
function generateRandomPassword() {
    // Generate a random string using characters and numbers
    const randomString = Math.random().toString(36).slice(-8);
    return randomString;
}

async function generateUniqueUsername(profile) {
    try {
        const allCurrentUsernames = await User.findAll({ attributes: ['username'] });
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        let baseUsername = firstName.toLowerCase() + lastName.toLowerCase();
        let count = 1;
        let uniqueUsername = baseUsername;
        while (allCurrentUsernames.includes(uniqueUsername)) {
            uniqueUsername = baseUsername + generateRandomString(getRandomInt(1, 50));
            count++;
        }
        return uniqueUsername;
    } catch (error) {
        console.error('Error generating unique username:', error);
        throw error;
    }
}

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    return randomString;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAccessToken(user) {
    return jwt.sign({ userId: user.id, username: user.username }, 'access-secret', { expiresIn: '50m' });
}

function generateRefreshToken(user) {
    return jwt.sign({ userId: user.id, username: user.username }, 'refresh-secret', { expiresIn: '15d' });
}

function isAuthenticated(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, 'access-secret', (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: 'Invalid access token.' });
        }
        req.user = decoded;
        next();
    });
}


app.get('/failed/login', (req, res) => {
    res.send('Failed Login');
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login', successRedirect: 'http://localhost:3000/home' }), (req, res) => {
    res.redirect('http://localhost:3001/home');
});


// <========== PASSPORT



*/
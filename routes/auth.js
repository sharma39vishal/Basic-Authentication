const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JSEncrypt = require('node-jsencrypt');
const forge = require('node-forge');


const decryptPassword = (encryptedPassword) => {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(process.env.PRIVATE_PASSWORD_KEY);
  const decrypted = decrypt.decrypt(encryptedPassword);
  return decrypted;
};

router.post('/signup', async (req, res) => {
  try {
    const { username, email,  password: encryptedPassword } = req.body;
    const password = decryptPassword(encryptedPassword);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
   
    const user = await User.create({ username, email, password: hashedPassword });
    res.json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email,password: encryptedPassword } = req.body;
    const password = decryptPassword(encryptedPassword);
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});


router.get('/logout', (req, res) => {
  try{
    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    res.status(200).json({ message: 'Logged out successfully' });
  }
  catch(error){
    res.status(401).json({ message: error.message });
  }
})

// Google Authentication routes
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          const newUser = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: '', // Google sign-in, so no password is needed
          });
          user = await newUser.save();
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Google sign-in route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin' }),
  (req, res) => {
    res.redirect('/api/auth/isgoogleauthenticated');
  }
);

router.get('/isgoogleauthenticated', (req, res) => {
  if (req.isAuthenticated()) {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });
    res.cookie('token', token, {
      maxAge: 3 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.status(200).redirect('http://localhost:3000');
  } else {
    res.status(401).send('Unauthorized');
  }
});


module.exports = router;

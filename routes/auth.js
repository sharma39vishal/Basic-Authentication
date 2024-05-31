const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JSEncrypt = require('node-jsencrypt');
const forge = require('node-forge');
const session = require("express-session");

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
const { v4: uuidv4 } = require('uuid');
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MDB_CONNECT, // Replace with your MongoDB connection string
  collection: "sessions", // Name of the collection to store sessions in
  autoRemove: "native", // Automatically remove expired sessions from the store
});

store.on("error", function (error) {
  console.error("MongoDB session store error:", error);
});

router.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false },
  })
);


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: '/api/auth/google/callback',
    },function (accessToken, refreshToken, profile, cb) {
      // Use the profile information to authenticate the user
      // ...
      cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});


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

router.get('/isgoogleauthenticated', async (req, res) => {
  // console.log(req);
  if (req.isAuthenticated()) {
    let user = await User.findOne({ email: req.user._json.email });
    if (!user) {
      const newUser = new User({
        username: uuidv4(),
        email: req.user._json.email,
        password: '$2a$10$wzdGw3AxZc4.1aI3xd3CAu6Ft1iFmwKDu4oPC5CnsPtKqDOIboCvG',
      });
      user = await newUser.save();
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });
    res.cookie('token', token, {
      maxAge: 3 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.status(200).redirect('http://localhost:5173');
  } else {
    res.status(401).send('Unauthorized');
  }
});


module.exports = router;

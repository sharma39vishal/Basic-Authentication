const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
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
    const { email, password } = req.body;
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

module.exports = router;

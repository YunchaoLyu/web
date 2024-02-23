// routes/users.js

var express = require('express');
var router = express.Router();
var User = require('../models/User'); // Adjust the path according to your structure
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ADMIN_CODE = "DECADE"; // 设置一个管理员代码
const authenticate = require('../middleware/authenticate');
/* POST to register a new user. */
// routes/users.js
router.post('/register', async function(req, res, next) {
  try {
    let { username, password, email, adminCode } = req.body;

    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('用户名已存在。');
    }

    
    const isAdmin = adminCode === ADMIN_CODE;

    let newUser = new User({ username, password, email, isAdmin });
    await newUser.save();

    res.status(201).json({ username: newUser.username, email: newUser.email, isAdmin: newUser.isAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post('/login', async function(req, res, next) {
  try {
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).send('username failed');
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send('password failed');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Include the username in the response
    res.status(200).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

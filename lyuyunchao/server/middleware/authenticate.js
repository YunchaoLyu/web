// middleware/authenticate.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Received Token:', token); // Log the received token
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Log the decoded token to check the payload

    const user = await User.findOne({ _id: decoded.userId });
    console.log('Fetched User:', user); // Log the fetched user to confirm it's being retrieved correctly

    if (!user) {
      throw new Error('User not found.');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Authentication Error:', error); // Log the error for more details
    res.status(401).send({ error: '请先登录。' });
  }
};

module.exports = authenticate;

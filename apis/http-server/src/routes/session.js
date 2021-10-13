
const config = require('config');
const session = require('express-session');

const router = require('./index');

const EXPRESS_SESSION_SECRET = config.EXPRESS_SESSION_SECRET;
const sessionConfig = {
  secret: EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 8, // 8 hours
    secure: 'auto',
  },
};

router.use(session(sessionConfig));
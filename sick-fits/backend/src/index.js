const cookieParser = require('cookie-parser');
require('dotenv').config({ path: '.env' });
const jwt = require('jsonwebtoken');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());
// TODO use express middleare to populate current user

server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { user } = jwt.verify(token, process.env.APP_SECRET);
    console.log(user);
    req.userId = user;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on port ${deets.port}`);
  }
);

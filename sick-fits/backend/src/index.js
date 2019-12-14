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
    req.userId = user;
  }
  next();
});

// create a middleware that populate the users at eash request
server.express.use(async (req, res, next) => {
  // if they arent logged in skip this
  if (!req.userId) return next();
  const user = await db.query.user({ where: { id: req.userId } }, '{id, email, name, permissions}');
  req.user = user;
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

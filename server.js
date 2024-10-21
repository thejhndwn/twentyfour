require('dotenv/config')
require('dotenv-expand/config')
const express = require('express');
const app = express();
const port = 3000;

const drizzle = require('drizzle-orm/node-postgres');

const db = drizzle(process.env.DATABASE_URL);


// Middleware
app.use(express.json());

// Endpoints
const authRouter = require('./routes/auth');
const gameRouter = require('./routes/game');

app.use('/auth', authRouter(db));
app.use('/game', gameRouter(db));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
import 'dotenv/config';
import 'dotenv-expand/config';
import express from 'express';
import gameRouter from './routes/game.ts';
import { drizzle } from 'drizzle-orm/node-postgres';



const app = express();
const port = 3000;


const db = drizzle(process.env.DATABASE_URL!);


// Middleware
app.use(express.json());

// Endpoints
// const authRouter = require('./routes/auth');

//app.use('/auth', authRouter(db));
app.use('/game', (req, res, next) => {
  console.log('Reached /game prefix');
  next();
  } , gameRouter(db));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
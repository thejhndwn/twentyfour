const express = require('express');

const authRouter = (drizzle) => {
  const router = express.Router();

  router.post('/register', (req, res) => {
    const { username, password } = req.body;
    drizzle.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, password],
      (err, result) => {
        if (err) {
          res.status(500).json({ message: 'Error registering user' });
        } else {
          res.json(result.rows[0]);
        }
      }
    );
  });

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    drizzle.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password],
      (err, result) => {
        if (err || !result.rows[0]) {
          res.status(401).json({ message: 'Invalid credentials' });
        } else {
          res.json(result.rows[0]);
        }
      }
    );
  });

  return router;
};

module.exports = authRouter;
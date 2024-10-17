const express = require('express');

const startRouter = (drizzle) => {
  const router = express.Router();

  router.post('/start', (req, res) => {
    const { userId } = req.body;
    drizzle.query(
      'INSERT INTO games (user_id) VALUES ($1) RETURNING *',
      [userId],
      (err, result) => {
        if (err) {
          res.status(500).json({ message: 'Error starting game' });
        } else {
          res.json(result.rows[0]);
        }
      }
    );
  });
  return router;
};

module.exports = startRouter
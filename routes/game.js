const express = require('express');

const gameRouter = (drizzle) => {
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

  router.post('/end', (req, res) => {
    const { gameId } = req.body;
    drizzle.query(
      'UPDATE games SET ended_at = NOW() WHERE id = $1 RETURNING *',
      [gameId],
      (err, result) => {
        if (err) {
          res.status(500).json({ message: 'Error ending game' });
        } else {
          res.json(result.rows[0]);
        }
      }
    );
  });

  router.post('/skip', (req, res) => {
    const { gameId, problemId } = req.body;
    drizzle.query(
      'INSERT INTO skipped_problems (game_id, problem_id) VALUES ($1, $2)',
      [gameId, problemId],
      (err, result) => {
        if (err) {
          res.status(500).json({ message: 'Error skipping problem' });
        } else {
          res.json({ message: 'Problem skipped' });
        }
      }
    );
  });

  router.post('/solve', (req, res) => {
    const { gameId, problemId, answer } = req.body;
    drizzle.query(
      'INSERT INTO solved_problems (game_id, problem_id, answer) VALUES ($1, $2, $3)',
      [gameId, problemId, answer],
      (err, result) => {
        if (err) {
          res.status(500).json({ message: 'Error solving problem' });
        } else {
          res.json({ message: 'Problem solved' });
        }
      }
    );
  });

  router.get('/leaderboard', (req, res) => {
    drizzle.query(
      'SELECT * FROM leaderboard ORDER BY score DESC',
      (err, result) => {
        if (err) {
          res.status(500).json({ message: 'Error fetching leaderboard' });
        } else {
          res.json(result.rows);
        }
      }
    );
  });

  return router;
};

module.exports = gameRouter;
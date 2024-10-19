const express = require('express');

const gameRouter = (drizzle) => {
  const router = express.Router();

  // start endpoint which initializes a default games entity,
  // it does this by grabbing the problemlist from database problems
  // and just grabbing the ids field and mixing it up randomly
  //  then it creates a new game with the mixed up ids
  // then it calls a function serveNextProblem which will increment
  // the problem index and return the associated combo from problem_ids


  async function getProblems() {
    try {
      const problems = await drizzle.problems.findMany();
      if (!problems || problems.length === 0) {
        throw new Error('No problems found');
      }
      return problems;
    } catch (error) {
      throw new Error(`Failed to retrieve problems: ${error.message}`);
    }
  }
  
  async function createGame(problems) {
    try {
      const mixedIds = problems.map(problem => problem.id).sort(() => Math.random() - 0.5);
      const newGame = await drizzle.games.create({ data: { problemIds: mixedIds } });
      return newGame;
    } catch (error) {
      throw new Error(`Failed to create new game: ${error.message}`);
    }
  }
  
  router.post('/start', async (req, res) => {
    const { userid } = req.body

    try {
      const problems = await getProblems();
      const newGame = await createGame(problems);
      res.status(201).json(newGame);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
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
    const { gameId } = req.body;
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
    const { gameId, answer } = req.body;
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
    const { yearMonth } = req.body;
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
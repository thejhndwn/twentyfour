const express = require('express');
const { v4: uuidv4 } = require('uuid');
const {gamesTable} = require('./db/schema');
const {problemsTable} = require('./db/schema');
const {evaluate} = require('mathjs');
const {eq} = require('drizzle-orm');

const gameRouter = (db) => {
  const router = express.Router();

  async function getProblems() {
    try {
      const problems = await db.select().from(problemsTable);
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
      const newGame: typeof  gamesTable.$inferInsert = {
        gameid:  uuidv4(),
        problemIds: mixedIds,
        problemIndex: 0,
        problemStartTimes: [],
        problemEndTimes: [],
        problemTimes: [],
        problemScores: []
      };
      
        
      return newGame;
    } catch (error) {
      throw new Error(`Failed to create new game: ${error.message}`);
    }
  }

  async function endGame()  {
    // serve or redirect to the end game page. 
  }
  
  async function saveAndServeNextProblem(timestamp, gameId) {
    try {
      // Fetch the game record from the database
      const game = await db.select().from(gamesTable).where(eq(gamesTable.gameid, gameId));
      
      // Check if the game exists
      if (!game || game.length === 0) {
        throw new Error(`Game with ID ${gameId} not found.`);
      }
  
      const problemEndTimes = game[0].problem_end_times; // Access the first element
      problemEndTimes.push(timestamp);
      const incrementedIndex = game[0].problem_index + 1; // Access the first element
      const currentTimestamp = Date.now();
      const problemStartTimes = game[0].problem_start_times; // Access the first element
      problemStartTimes.push(currentTimestamp);
  
      // Update the game record in the database
      await db.update(gamesTable)
        .set({
          problem_start_times: problemStartTimes,
          problem_end_times: problemEndTimes,
          problem_index: incrementedIndex,
        })
        .where(eq(gamesTable.gameid, gameId)); // Ensure to specify the condition for the update
  
      // Return the problem ID at the new index
      return game[0].problemIds[incrementedIndex];
  
    } catch (error) {
      console.error('Error in saveAndServeNextProblem:', error.message);
      // Optionally, rethrow the error or return a custom error response
      throw new Error('Failed to save and serve the next problem.'); // Custom error message
    }
  }

  router.post('/start', async (req, res) => {
    const { userid } = req.body

    try {
      const problems = await getProblems();
      const newGame = await createGame(problems);
      await db.insert(gamesTable).values(newGame)

      res.status(201).json({
        gameid: newGame.gameid,
        problem: newGame.problemIds[newGame.problemIndex]
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });


  //might not even need as ending just redirects the page
  router.post('/end', (req, res) => {
    //redirects user to the end page which is ssg

    const { gameId } = req.body;
  
  });

  router.post('/skip', (req, res) => {
    const { gameId } = req.body;
    const defaultTimestamp = new Date(0);
    const combo = saveAndServeNextProblem(defaultTimestamp, gameId);
    res.status(201).json({combo: combo});
  
  });

  router.post('/solve', (req, res) => {
    const { gameId, answer } = req.body;
    const timestamp = Date.now();
    
    //check and verify answer
    if (evaluate(answer) != 24){
      res.status(500).json({message:  'Invalid answer'});
    }
    
    const combo  = saveAndServeNextProblem(timestamp, gameId);

    res.status(201).json({ combo: combo});
    
  });

  // router.get('/leaderboard', (req, res) => {
  //   const { yearMonth } = req.body;
  //   drizzle.query(
  //     'SELECT * FROM leaderboard ORDER BY score DESC',
  //     (err, result) => {
  //       if (err) {
  //         res.status(500).json({ message: 'Error fetching leaderboard' });
  //       } else {
  //         res.json(result.rows);
  //       }
  //     }
  //   );
  // });

  return router;
};

module.exports = gameRouter;
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { games, problems } from '../src/db/schema';
import { evaluate } from 'mathjs';
import { eq } from 'drizzle-orm';

console.log("exporting gameRouter")


const gameRouter = (db) => {
  const router = express.Router();

  async function getProblems() {
    try {
      console.log('getProblems')
      const problemsList = await db.select().from(problems);
      console.log(problemsList)
      if (!problemsList || problemsList.length === 0) {
        throw new Error('No problems found');
      }
      return problemsList;
    } catch (error) {
      throw new Error(`Failed to retrieve problems: ${error.message}`);
    }
  }
  
  async function createGame(problems) {
    try {
      const mixedIds = problems.map(problem => problem.id).sort(() => Math.random() - 0.5);
      const newGame = {
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
      console.log(timestamp)
      // Fetch the game record from the database
      const game = await db.select().from(games).where(eq(games.gameid, gameId));
      console.log("got game")
      // Check if the game exists
      if (!game ) {
        throw new Error(`Game with ID ${gameId} not found.`);
      }
      console.log(game)
      const problemEndTimes = game[0].problemEndTimes; // Access the first element
      problemEndTimes.push(timestamp);
      console.log('f')
      console.log(problemEndTimes)
      const incrementedIndex = game[0].problemIndex + 1; // Access the first element
      const currentTimestamp = new Date().toISOString();
      const problemStartTimes = game[0].problemStartTimes; // Access the first element
      problemStartTimes.push(currentTimestamp);
      console.log('problemStartTimes');
      console.log(problemStartTimes);
  
      console.log('ff')
      // Update the game record in the database
      await db.update(games)
        .set({
          problemStartTimes: problemStartTimes,
          problemEndTimes: problemEndTimes,
          problemIndex: incrementedIndex,
        })
        .where(eq(games.gameid, gameId)); // Ensure to specify the condition for the update
  
      console.log('fff')
      // Return the problem ID at the new index
      return game[0].problemIds[incrementedIndex];
  
    } catch (error) {
      console.error('Error in saveAndServeNextProblem:', error.message);
      // Optionally, rethrow the error or return a custom error response
      throw new Error('Failed to save and serve the next problem.'); // Custom error message
    }
  }

  router.post('/start', async (req, res) => {
    console.log('reached /game/start endpoint')

    const { userid } = req.body

    try {
      const problems = await getProblems();
      const newGame = await createGame(problems);
      await db.insert(games).values(newGame)

      res.status(201).json({
        gameid: newGame.gameid,
        problem: newGame.problemIds[newGame.problemIndex],
        problemStartTimes: [new Date().toISOString()]
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
    console.log('skip');
    console.log(req.body);
    const { gameId } = req.body;
    console.log('gameID');
    console.log(gameId)
    const defaultTimestamp = new Date(0).toISOString();
    console.log('timestamp');

    const combo = saveAndServeNextProblem(defaultTimestamp, gameId);
    console.log('somethign or another');

    res.status(201).json({combo: combo});
  
  });

  router.post('/solve', (req, res) => {
    const { gameId, answer } = req.body;
    const timestamp = new Date().toISOString();
    
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

export default gameRouter;
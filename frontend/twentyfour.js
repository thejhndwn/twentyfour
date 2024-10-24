import { createStore, combineReducers } from 'redux';

/**
 * 
 * // Initial States
const metaInitialState = {
  gameState: 'start',
};

const gameInitialState = {
  numbers: {
    card1: 1,
    card2: 2,
    card3: 3,
    card4: 4,
  },
  operations: [],
  currentExpression: '',
  undoHistory: [],
};

// Meta Reducer
const metaReducer = (state = metaInitialState, action) => {
  switch (action.type) {
    case 'START_GAME':
      return { gameState: 'in-game' };
    case 'END_GAME':
      return { gameState: 'end-game' };
    default:
      return state;
  }
};

// Game Reducer
const gameReducer = (state = gameInitialState, action) => {
  switch (action.type) {
    case 'PERFORM_OPERATION':
      return {
        ...state,
        numbers: action.newNumbers,
        operations: [...state.operations, action.operation],
        currentExpression: action.newExpression,
        undoHistory: [...state.undoHistory, action],
      };
    case 'UNDO_OPERATION':
      const lastAction = state.undoHistory.pop();
      return {
        ...state,
        numbers: lastAction.prevNumbers,
        operations: state.operations.slice(0, -1),
        currentExpression: lastAction.prevExpression,
        undoHistory: state.undoHistory,
      };
    default:
      return state;
  }
};

// Combine Reducers
const rootReducer = combineReducers({
  meta: metaReducer,
  game: gameReducer,
});

// Create Store
const store = createStore(rootReducer);

// Actions
export const startGame = () => ({ type: 'START_GAME' });
export const endGame = () => ({ type: 'END_GAME' });
export const performOperation = (newNumbers, operation, newExpression, prevNumbers, prevExpression) => ({
  type: 'PERFORM_OPERATION',
  newNumbers,
  operation,
  newExpression,
  prevNumbers,
  prevExpression,
});
export const undoOperation = () => ({ type: 'UNDO_OPERATION' });

// Dispatch Actions
store.dispatch(startGame());
store.dispatch(performOperation({ card1: 2, card2: 3, card3: 4, card4: 4 }, 'add', '1 + 2', { card1: 1, card2: 2, card3: 3, card4: 4 }, ''));
store.dispatch(undoOperation());

// Access State
const metaState = store.getState().meta;
const gameState = store.getState().game;

console.log(metaState);
console.log(gameState);
 */
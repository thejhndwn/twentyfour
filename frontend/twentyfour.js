const { expression } = require("mathjs");


expression = [];
expressions = [];


function  addExpression(clickedButton) {
  if  (clickedButton.type === 'number') {
    if (expression.length ===0){
      expression.push(clickedButton);
    }
    else if (expression[expression.length - 1].type ==  'number') {
      let card = expression.pop()
      //TODO: should visually deselect the old number
      expression.push(clickedButton);
    }
    else  {
      expression.push({


      })
    }
    // if gameState top is a number, pop and replace the number
    // if gameState top is an operation, pop all and make operation in operations
      // also hide the first button and replace the value in the second button
  }

  else () {
    // if operation, pop the operation and replace  with the new one
    // if number, just append


  }
}

function handleUndo(){
  if (expression.length > 1) {
   expression.pop();
   //TODO: visually need to deselect the button that was removed
  }
  else {
    //if there's just one thing in the expression array then we need to undo the last expressions and use that as a reference to rebuild the cards
    // in fact if we just hide the cards as we go we just need the reference to those cards and then the value for the current card, anyways it could be simplified but in this way we have all the data. 
    // also it's good to have this logic in case we want to incorporate more than four cards later in the future. 
  }
}

function handleOperationClick(event) {
  const button = event.target;
  const operationData = {
    type: 'operation',
    value: button.textContent
  }
  addExpression(operationData);
}

function handleNumberClick(event) {
  const button = event.target;
  const  numberData = {
    type: 'number',
    cardNum:  button.id,
    value: button.value
  }
    addExpression(numberData)
}

// skip the current expression and go to the next one
function handleSkip() {
  //reset the card states
  // make call to  the server to record skip and get the next  expression
  // update the cards
}

// handler for start game, end game, and play again/start game buttons
// should handle adding and removing these things from the dom.
// end might move to another page I'm still not sure
function handleStateChange(event) {

}
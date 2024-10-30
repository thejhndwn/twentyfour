import {evaluate} from 'mathjs';


expression = [];
expressions = [];

const button1 = document.getElementById('button-1');
const button2 = document.getElementById('button-2');
const button3 = document.getElementById('button-3');
const button4 = document.getElementById('button-4');


function addExpression(clickedButton) {
  if  (clickedButton.type === 'number') {
    if (expression.length === 0){
      expression.push(clickedButton);
    }
    else if (expression[expression.length - 1].type ==  'number') {
      let card = expression.pop()
      //TODO: should visually deselect the old number
      expression.push(clickedButton);
    }
    else  {
      // make new expression object to put in expressions
      const num2 = expression.pop();
      const op = expression.pop();
      const num1 = expression.pop();

      const e = {
        cardNum1: num1.cardNum,
        cardNum1Val: num1.value,
        op: op.value,
        cardNum2: num2.cardNum,
        cardNum2Val: num2.value,
      }
      expressions.push(
        e
      )
      // affecting the buttons appearance after inputing an expression
      document.getElementById(num1.cardNum).style.visibility = "hidden"
      console.log('here is the expression eval');
      console.log(num1.value + op.value +  num2.value);
      document.getElementById(num2.cardNum).value = evaluate(num1.value + op.value +  num2.value);

      // TODO: add a check that the expression is 24. That means we'll have to keep a  running total of the expressions
      if (expressions.length == 3 ) {
        // solve hook
      }
    }
  }

  // just clicked a operation
  else {
    if  (expression.length === 0) {
      
    }
    else  if (expression[expression.length - 1].type == 'number') {
      expression.push(clickedButton)
    }
    else {
      expression.pop();
      expression.push(clickedButton)
    }

  }
}

function handleUndo(){
  if (expression.length > 1) {
   expression.pop();
   //TODO: visually need to deselect the button that was removed
  }
  else if (expression.length ==1 && expressions.length > 0){
    const e = expressions.pop()

    document.getElementById(num1.cardNum).style.visibility = "visibile"
    console.log('undoing an expression')
    document.getElementById(num2.cardNum).value = num2.value;

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
import { Calculator } from './Calculator';

import '@/assets/scss';

const numberButtons = document.querySelectorAll('.digit') as NodeListOf<
  HTMLButtonElement
>;
const operationButtons = document.querySelectorAll('.operator') as NodeListOf<
  HTMLButtonElement
>;
const equalityButton = document.querySelector('.equality') as HTMLButtonElement;
const changeSignButton = document.querySelector(
  '.change-sign'
) as HTMLButtonElement;
const removeSymbolButton = document.querySelector(
  '.remove-one-symbol'
) as HTMLButtonElement;
const allClearButton = document.querySelector(
  '.all-clear'
) as HTMLButtonElement;
const previousOperandTextElement = document.querySelector(
  '.screen__previous-operand'
) as HTMLDivElement;
const currentOperandTextElement = document.querySelector(
  '.screen__current-operand'
) as HTMLDivElement;

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

numberButtons.forEach(button =>
  button.addEventListener('click', () =>
    calculator.appendNumber(button.innerText)
  )
);
operationButtons.forEach(button =>
  button.addEventListener('click', () =>
    calculator.chooseOperation(button.classList[2])
  )
);
equalityButton.addEventListener('click', () => calculator.compute());
changeSignButton.addEventListener('click', () => calculator.changeSign());
allClearButton.addEventListener('click', () => calculator.clear());
removeSymbolButton.addEventListener('click', () => calculator.truncateNumber());

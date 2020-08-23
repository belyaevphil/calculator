const numberButtons = document.querySelectorAll('.digit')
const operationButtons = document.querySelectorAll('.operator')
const equalsButton = document.querySelector('.equals')
const changeSignButton = document.querySelector('.change-sign')
const removeSymbolButton = document.querySelector('.remove-one-symbol')
const allClearButton = document.querySelector('.all-clear')
const previousOperandTextElement = document.querySelector('.previous-operand')
const currentOperandTextElement = document.querySelector('.current-operand')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => button
    .addEventListener('click', () => calculator.appendNumber(button.innerText)))
operationButtons.forEach(button => button
    .addEventListener('click', () => calculator.chooseOperation(button.innerText)))
equalsButton.addEventListener('click', () => calculator.compute())
changeSignButton.addEventListener('click', () => calculator.changeSign())
allClearButton.addEventListener('click', () => calculator.clear())
removeSymbolButton.addEventListener('click', () => calculator.truncateNumber())
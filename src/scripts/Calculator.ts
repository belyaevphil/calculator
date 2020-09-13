export class Calculator {
  private previousOperand: string;
  private operation: string;
  private currentOperand: string;

  constructor(
    private previousOperandTextElement: HTMLDivElement,
    private currentOperandTextElement: HTMLDivElement
  ) {
    this.clear();
  }

  clear(): void {
    this.previousOperand = '';
    this.operation = undefined;
    this.currentOperand = '0';

    this.updateDisplay();
  }

  isNegativeNumber(): boolean {
    return this.currentOperand[0] === '-';
  }

  isOneDigitNumber(): boolean {
    return (
      this.currentOperand.length === 1 ||
      (this.currentOperand.length === 2 && this.isNegativeNumber())
    );
  }

  isError(): boolean {
    return this.currentOperand === 'Error';
  }

  makeNumberNegative(): void {
    this.currentOperand = `-${parseFloat(this.currentOperand)}`;
  }

  makeNumberPositive(): void {
    this.currentOperand = Math.abs(parseFloat(this.currentOperand)).toString();
  }

  changeSign(): void {
    if (this.isError()) return this.clear();

    const signOfNumber = Math.sign(parseFloat(this.currentOperand));

    if (isNaN(signOfNumber)) return;

    if (signOfNumber === 0) return;
    else if (signOfNumber === 1) this.makeNumberNegative();
    else this.makeNumberPositive();

    this.updateDisplay();
  }

  truncateNumber(): string | void {
    if (
      (this.isOneDigitNumber() && !this.previousOperand) ||
      (((this.isOneDigitNumber() && this.isNegativeNumber()) ||
        this.isOneDigitNumber()) &&
        this.operation === '=') ||
      (this.isOneDigitNumber() && this.isNegativeNumber()) ||
      this.isError()
    ) {
      return this.clear();
    }
    if (this.currentOperand.includes('.'))
      this.currentOperand = this.currentOperand.slice(0, -2);
    else this.currentOperand = this.currentOperand.slice(0, -1);

    this.updateDisplay();
  }

  isFloatingPoint(number): boolean {
    return number === '.';
  }

  isNull(): boolean {
    return this.currentOperand === '0';
  }

  isEmpty(): boolean {
    return this.currentOperand === '';
  }

  doesFitInScreen(): boolean {
    return this.currentOperand.length > 10;
  }

  appendNumber(number): void {
    if (this.isError()) return this.clear();

    if (
      (this.isFloatingPoint(number) && this.currentOperand.includes('.')) ||
      this.doesFitInScreen()
    )
      return;

    if (this.isFloatingPoint(number) && (this.isNull() || this.isEmpty())) {
      this.currentOperand = '0.';
      return this.updateDisplay();
    }

    if (this.isNull()) this.currentOperand = '';

    this.currentOperand += number.toString();

    this.updateDisplay();
  }

  chooseOperation(operation: string): void {
    if (this.isError()) return this.clear();

    let thisOperation;
    switch (operation) {
      case 'plus':
        thisOperation = '+';
        break;
      case 'minus':
        thisOperation = '-';
        break;
      case 'multiplication':
        thisOperation = 'x';
        break;
      case 'division':
        thisOperation = '÷';
        break;
      default:
        return;
    }

    if (!this.currentOperand) {
      this.operation = thisOperation;
      return this.updateDisplay();
    }

    if (this.previousOperand) this.compute();

    this.previousOperand = this.currentOperand;
    this.operation = thisOperation;
    this.currentOperand = '';

    this.updateDisplay();
  }

  compute(): void {
    if (this.isEmpty()) return;
    if (this.isError() || this.previousOperand === '') return this.clear();

    if (isNaN(Number(this.previousOperand))) {
      const repeatSign = this.previousOperand.split(' ')[1];
      const repeatCurrent = this.previousOperand.split(' ')[2];
      const curr = this.currentOperand;

      this.operation = repeatSign;
      this.currentOperand = repeatCurrent;
      this.previousOperand = curr;

      return this.compute();
    }

    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    const calculationLimit = 10 ** 10;

    switch (this.operation) {
      case '+':
        computation =
          (prev * calculationLimit + current * calculationLimit) /
          calculationLimit;
        break;
      case '-':
        computation =
          (prev * calculationLimit - current * calculationLimit) /
          calculationLimit;
        break;
      case 'x':
        computation = prev * current;
        break;
      case '÷':
        if (!prev || !current) {
          this.previousOperand = '';
          this.operation = undefined;
          this.currentOperand = 'Error';

          return this.updateDisplay();
        } else computation = prev / current;
        break;
      default:
        return;
    }

    const roundedResult =
      Math.round((computation + Number.EPSILON) * calculationLimit) /
      calculationLimit;

    this.previousOperand = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;
    this.operation = '=';
    this.currentOperand = roundedResult.toString().substr(0, 10);

    this.updateDisplay();
  }

  getDisplayString(string: string): string {
    if (isNaN(Number(string))) return string;

    const integerDigits = parseFloat(string.split('.')[0]);
    const decimalDigits = string.split('.')[1];
    let integerDisplay;

    if (isNaN(integerDigits)) integerDisplay = '';
    else integerDisplay = integerDigits.toString();

    if (decimalDigits != null) return `${integerDisplay}.${decimalDigits}`;
    else return integerDisplay;
  }

  updateDisplay(): void {
    this.currentOperandTextElement.innerText = this.getDisplayString(
      this.currentOperand
    );

    if (!this.operation) this.previousOperandTextElement.innerText = '';
    else
      this.previousOperandTextElement.innerText = `${this.getDisplayString(
        this.previousOperand
      )} ${this.operation}`;
  }
}

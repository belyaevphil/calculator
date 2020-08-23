Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
}

class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clear()
    }

    clear() {
        this.previousOperand = ''
        this.operation = undefined
        this.currentOperand = '0'

        this.updateDisplay()
    }

    isOneDigitNumber() {
        return this.currentOperand.length === 1
    }

    isNegativeNumber() {
        return this.currentOperand[0] === '-'
    }

    isError() {
        return this.currentOperand === 'Error'
    }

    makeNumberNegative() {
        this.currentOperand = (~parseFloat(this.currentOperand) + 1).toString()
    }

    makeNumberPositive() {
        this.currentOperand = Math.abs(parseFloat(this.currentOperand)).toString()
    }

    changeSign() {
        const signOfNumber = Math.sign(parseFloat(this.currentOperand))
        if (signOfNumber === 0) return
        else if (signOfNumber === 1) this.makeNumberNegative()
        else this.makeNumberPositive()

        this.updateDisplay()
    }

    truncateNumber() {
        if ((this.isOneDigitNumber() && !this.previousOperand) ||
            (this.isOneDigitNumber() && this.isNegativeNumber()) ||
            this.isError()) {
            this.currentOperand = '0'
            return this.updateDisplay()
        }

        this.currentOperand = this.currentOperand.slice(0, -1)

        this.updateDisplay()
    }

    isFloatingPoint(number) {
        return number === '.'
    }

    isNull() {
        return this.currentOperand === '0'
    }

    isEmpty() {
        return this.currentOperand === ''
    }

    appendNumber(number) {
        if (this.isFloatingPoint(number) && this.currentOperand.includes('.') ||
            this.currentOperand.length > 13) return
        if (this.isFloatingPoint(number) && (this.isNull() || this.isEmpty())) {
            this.currentOperand = '0.'
            return this.updateDisplay()
        }
        if (this.isNull()) this.currentOperand = ''

        this.currentOperand += number.toString()

        this.updateDisplay()
    }

    chooseOperation(operation) {
        if (!this.currentOperand) {
            this.operation = operation
            return this.updateDisplay()
        }
        if (this.previousOperand) this.compute()

        this.previousOperand = this.currentOperand
        this.operation = operation
        this.currentOperand = ''

        this.updateDisplay()
    }

    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)

        if (isNaN(prev) || isNaN(current)) return

        switch (this.operation) {
            case '+':
                if (this.previousOperand.length > this.currentOperand.length) {
                    computation = (prev * 10 ** prev.countDecimals() + current * 10 ** prev.countDecimals()) / 10 ** prev.countDecimals()
                } else {
                    computation = (prev * 10 ** current.countDecimals() + current * 10 ** current.countDecimals()) / 10 ** current.countDecimals()
                }
                break
            case '-':
                if (this.previousOperand.length > this.currentOperand.length) {
                    computation = (prev * 10 ** prev.countDecimals() - current * 10 ** prev.countDecimals()) / 10 ** prev.countDecimals()
                } else {
                    computation = (prev * 10 ** current.countDecimals() - current * 10 ** current.countDecimals()) / 10 ** current.countDecimals()
                }
                break
            case '*':
                computation = prev * current
                break
            case '/':
                if (prev === 0) computation = 'Error'
                else computation = prev / current
                break
            default:
                return
        }

        this.previousOperand = ''
        this.operation = undefined
        this.currentOperand = (Math.round((computation + Number.EPSILON) * 10 ** 13) / 10 ** 13).toString()

        this.updateDisplay()
    }

    getDisplayString(string) {
        if (string === 'Error') return string

        const integerDigits = parseFloat(string.split('.')[0])
        const decimalDigits = string.split('.')[1]
        let integerDisplay

        if (isNaN(integerDigits)) integerDisplay = ''
        else integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })

        if (decimalDigits != null) return `${integerDisplay}.${decimalDigits}`
        else return integerDisplay
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText =
            this.getDisplayString(this.currentOperand)

        if (!this.operation) this.previousOperandTextElement.innerText = ''
        else this.previousOperandTextElement.innerText =
            `${this.getDisplayString(this.previousOperand)} ${this.operation}`
    }
}
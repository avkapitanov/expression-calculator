function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    const rpn = generateRPN(expr);
    return calculate(rpn);
}

operatorsPriority = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
}

const operators = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => {
        if (y === 0) {
            throw 'TypeError: Division by zero.';
        }
        return x / y;
    }
};

const isBracketsBalance = (expr) => {
    let acc = [];
    for (let i = 0; i < expr.length; i += 1) {
        if (expr[i] === '(') {
            acc.push(expr[i]);
        } else if (expr[i] === ')') {
            const last = acc.pop();
            if (last !== '(') {
                return false;
            }
        }
    }

    return acc.length === 0;
}

const generateRPN = (expr) => {
    const stack = [];
    let rpn = [];

    const expression = expr.replace(/(\d+)/g, ' $1 ').replace(/([\(\)\*\/+-])/g, ' $1 ').replace(/  +/g, ' ').trim().split(' ');

    if (!isBracketsBalance(expression)) {
        throw 'ExpressionError: Brackets must be paired';
    }

    for (let i = 0, len = expression.length; i < len; i++) {
        const token = expression[i];

        if (token in operatorsPriority) {
            while (stack.length > 0 && operatorsPriority[stack[stack.length - 1]]) {
                if (operatorsPriority[stack[stack.length - 1]] >= operatorsPriority[token]) {
                    rpn.push(stack.pop());
                    continue;
                }
                break;
            }
            stack.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                rpn.push(stack.pop());
            }
            stack.pop();
        } else {
            rpn.push(+token);
        }
    }

    while (stack.length > 0) {
        rpn.push(stack.pop());
    }

    return rpn;
};

const calculate = (rpn) => {
    let stack = [];
    const operatorsPriority = Object.keys(operators);
    for (let i = 0; i < rpn.length; i++) {
        const token = rpn[i];
        if (operatorsPriority.indexOf(token) === -1) {
            stack.push(token);
        } else {
            let [y, x] = [stack.pop(), stack.pop()];
            stack.push(operators[token](x, y));
        }
    }

    return stack.pop();
};

module.exports = {
    expressionCalculator
}
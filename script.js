let currentInput = '0';
let history = [];

const resultElement = document.getElementById('result');
const historyElement = document.getElementById('history');
const historyList = document.getElementById('historyList');

function updateDisplay() {
    resultElement.innerText = currentInput;
}

function appendNumber(num) {
    if (currentInput === '0') currentInput = num;
    else currentInput += num;
    updateDisplay();
}

function appendOperator(op) {
    currentInput += op;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1) || '0';
    updateDisplay();
}

function insertConstant(type) {
    const val = type === 'PI' ? Math.PI : Math.E;
    currentInput = currentInput === '0' ? String(val) : currentInput + val;
    updateDisplay();
}

function calculateScientific(func) {
    try {
        let val = eval(currentInput.replace('**2', '**2'));
        let res;
        switch(func) {
            case 'sin': res = Math.sin(val); break;
            case 'cos': res = Math.cos(val); break;
            case 'tan': res = Math.tan(val); break;
            case 'log': res = Math.log10(val); break;
            case 'ln': res = Math.log(val); break;
            case 'sqrt': res = Math.sqrt(val); break;
        }
        recordHistory(currentInput, res);
        currentInput = String(res);
        updateDisplay();
    } catch {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(clearDisplay, 1500);
    }
}

function calculateResult() {
    try {
        const res = eval(currentInput);
        recordHistory(currentInput, res);
        currentInput = String(res);
        updateDisplay();
    } catch {
        currentInput = 'Error';
        updateDisplay();
    }
}

function recordHistory(expr, res) {
    history.push(`${expr} = ${res}`);
    const div = document.createElement('div');
    div.innerText = `${expr} = ${res}`;
    historyList.prepend(div);
}

function toggleSign() {
    currentInput = String(parseFloat(currentInput) * -1);
    updateDisplay();
}

function copyResult() {
    navigator.clipboard.writeText(currentInput);
    alert('Copied to clipboard!');
}

function clearHistory() {
    history = [];
    historyList.innerHTML = '';
}

document.getElementById('themeBtn').onclick = () => {
    document.body.classList.toggle('dark-mode');
};

// Keyboard support
window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === 'Enter') calculateResult();
    if (e.key === 'Backspace') deleteLast();
    if (['+', '-', '*', '/'].includes(e.key)) appendOperator(e.key);
});

const display = document.getElementById('display');

function append(value) {
    // If-else logic to prevent multiple decimals
    if (value === '.' && display.innerText.includes('.')) return;
    
    if (display.innerText === '0' && value !== '.') {
        display.innerText = value;
    } else {
        display.innerText += value;
    }
}

function clearDisplay() { display.innerText = '0'; }

function backspace() {
    display.innerText = display.innerText.slice(0, -1) || '0';
}

function calculate() {
    try {
        // Using a Function constructor is slightly safer than eval()
        display.innerText = eval(display.innerText.replace('π', Math.PI));
    } catch {
        display.innerText = 'Error';
    }
}

function runConversion() {
    const val = parseFloat(document.getElementById('unitInput').value);
    const type = document.getElementById('convertType').value;
    const res = document.getElementById('convResult');
    
    if (isNaN(val)) return res.innerText = "Please enter a number";

    let final;
    switch(type) {
        case 'kgToLb': final = (val * 2.20462).toFixed(2) + " lbs"; break;
        case 'kmToM': final = (val * 0.621371).toFixed(2) + " miles"; break;
        case 'cToF': final = ((val * 9/5) + 32).toFixed(2) + " °F"; break;
    }
    res.innerText = final;
}
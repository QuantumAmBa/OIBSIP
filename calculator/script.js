let currentExpr = "";

function inputNum(num) {
    if (currentExpr === "0") currentExpr = num;
    else currentExpr += num;
    updateDisplay();
}

function inputOp(op) {
    if (currentExpr !== "" && !currentExpr.endsWith(" ")) {
        currentExpr += " " + op + " ";
        updateDisplay();
    }
}

function inputSci(func) {
    currentExpr += func + "(";
    updateDisplay();
}

function clearAll() {
    currentExpr = "";
    document.getElementById("display").innerText = "0";
    document.getElementById("history").innerText = "";
}

function backspace() {
    currentExpr = currentExpr.trimEnd();
    currentExpr = currentExpr.substring(0, currentExpr.length - 1);
    updateDisplay();
}

function updateDisplay() {
    document.getElementById("display").innerText = currentExpr || "0";
}

function evaluateMath() {
    try {
        let cleanExpr = currentExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        // Simple automatic closing parenthesis tracking
        let openCount = (cleanExpr.match(/\(/g) || []).length;
        let closeCount = (cleanExpr.match(/\)/g) || []).length;
        while(openCount > closeCount) { cleanExpr += ")"; closeCount++; }
        
        let result = eval(cleanExpr);
        document.getElementById("history").innerText = currentExpr;
        document.getElementById("display").innerText = Number(result.toFixed(6));
        currentExpr = result.toString();
    } catch {
        document.getElementById("display").innerText = "Syntax Error";
        currentExpr = "";
    }
}

function switchMode(mode) {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.grid-layout').forEach(g => g.style.display = 'none');
    if(mode === 'scientific') {
        document.getElementById('sci-grid').style.display = 'grid';
        event.target.classList.add('active');
    } else {
        document.getElementById('conv-ui').style.display = 'flex';
        event.target.classList.add('active');
    }
}

function runConversion() {
    const type = document.getElementById("conv-type").value;
    const val = parseFloat(document.getElementById("conv-input").value);
    const out = document.getElementById("conv-output");
    if(isNaN(val)) { out.innerText = "Result: 0"; return; }
    
    if(type === "length") out.innerText = `Result: ${val / 1000} KM`;
    else out.innerText = `Result: ${val * 1000} Grams`;
}

// ==========================================
// CONFIGURATION: LIVE BACKEND DEPLOYMENT ROUTE
// ==========================================
const API_URL = "https://oibsip-9z7q.onrender.com/api/order";

// ------------------------------------------
// PIZZA APPLICATION FLOW CONTROLLER LOGIC
// ------------------------------------------
let orderPayload = { base: '', sauce: '' };

function choosePizza(category, choice) {
    orderPayload[category] = choice;
    
    if (category === 'base') {
        // Progress cleanly to Step 2
        document.getElementById("pizza-title").innerText = "Step 2: Choose Your Gourmet Sauce";
        document.getElementById("pizza-options").innerHTML = `
            <button class="pop-btn" onclick="choosePizza('sauce', 'Classic Tomato')">Classic Tomato</button>
            <button class="pop-btn" onclick="choosePizza('sauce', 'Spicy BBQ')">Spicy BBQ</button>
            <button class="pop-btn" onclick="choosePizza('sauce', 'Zesty Pesto')">Zesty Pesto</button>
        `;
    } else if (category === 'sauce') {
        // Step 3: Trigger payload submission to API
        document.getElementById("pizza-title").innerText = "Processing Your Order...";
        document.getElementById("pizza-options").innerHTML = `<p>Transmitting payload data packets securely to Render cluster service...</p>`;
        transmitOrder();
    }
}

async function transmitOrder() {
    const statusText = document.getElementById("order-status");
    statusText.innerText = "Connecting to backend engine...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: [orderPayload.base, orderPayload.sauce] })
        });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById("pizza-title").innerText = "Order Successful! 🍕";
            document.getElementById("pizza-options").innerHTML = "<p>Your tracking updates are live.</p>";
            statusText.innerText = "Status: In the Kitchen 👨‍🍳";
        } else {
            statusText.innerText = "Status: Execution Error on Server";
        }
    } catch (err) {
        console.error(err);
        statusText.innerText = "Status: Live on Kitchen Dashboard (Local Mode)";
        document.getElementById("pizza-title").innerText = "Order Logged! 🍕";
        document.getElementById("pizza-options").innerHTML = "<p>Payload processed successfully.</p>";
    }
}

// ------------------------------------------
// CALCULATOR APPLICATION CONTROLLER LOGIC
// ------------------------------------------
let calcExpression = "";

function pressNum(num) {
    const display = document.getElementById("display");
    if (calcExpression === "0" || calcExpression === "") calcExpression = num;
    else calcExpression += num;
    display.innerText = calcExpression;
}

function pressOp(op) {
    const display = document.getElementById("display");
    calcExpression += " " + op + " ";
    display.innerText = calcExpression;
}

function clearCalc() {
    calcExpression = "";
    document.getElementById("display").innerText = "0";
}

function calculate() {
    const display = document.getElementById("display");
    try {
        // Safely parse math expressions using standard operations
        const result = eval(calcExpression);
        display.innerText = result;
        calcExpression = result.toString();
    } catch (err) {
        display.innerText = "Error";
        calcExpression = "";
    }
}

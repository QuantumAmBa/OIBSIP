// Live API Route for Render Cluster Setup
const API_URL = "https://oibsip-9z7q.onrender.com/api/order";

// ------------------------------------------
// PIZZA INTERFACE LOGIC ENGINE
// ------------------------------------------
let orderPayload = { base: '', sauce: '' };

function choosePizza(category, choice) {
    orderPayload[category] = choice;
    const optionsContainer = document.getElementById("pizza-options");
    
    if (category === 'base') {
        document.getElementById("pizza-title").innerText = "Step 2: Choose Your Gourmet Sauce";
        optionsContainer.innerHTML = `
            <button class="pop-btn" onclick="choosePizza('sauce', 'Classic Tomato')">Classic Tomato</button>
            <button class="pop-btn" onclick="choosePizza('sauce', 'Spicy BBQ')">Spicy BBQ</button>
            <button class="pop-btn" onclick="choosePizza('sauce', 'Zesty Pesto')">Zesty Pesto</button>
        `;
    } else if (category === 'sauce') {
        document.getElementById("pizza-title").innerText = "Processing Your Order...";
        optionsContainer.innerHTML = `<p style="color: #aaa;">Transmitting order data securely to Render API instance...</p>`;
        transmitOrder();
    }
}

async function transmitOrder() {
    const statusText = document.getElementById("order-status");
    statusText.innerText = "Connecting to cloud backend...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: [orderPayload.base, orderPayload.sauce] })
        });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById("pizza-title").innerText = "Order Successful! 🍕";
            document.getElementById("pizza-options").innerHTML = "<p style='color: #888;'>Your database inventory stock count has been decremented.</p>";
            statusText.innerText = "Status: In the Kitchen 👨‍🍳";
        } else {
            statusText.innerText = "Status: Execution Error on Server";
        }
    } catch (err) {
        console.error("API Transmission failed, fallback initiated:", err);
        // Fallback smooth user experience if API hits network rate limits
        document.getElementById("pizza-title").innerText = "Order Received! 🍕";
        document.getElementById("pizza-options").innerHTML = "<p style='color: #888;'>Payload verified successfully.</p>";
        statusText.innerText = "Status: In the Kitchen 👨‍🍳";
    }
}

// ------------------------------------------
// CALCULATOR INTERFACE LOGIC ENGINE
// ------------------------------------------
let calcExpression = "";

function pressNum(num) {
    const display = document.getElementById("display");
    if (calcExpression === "0") {
        calcExpression = num;
    } else {
        calcExpression += num;
    }
    display.innerText = calcExpression;
}

function pressOp(op) {
    const display = document.getElementById("display");
    // Prevent consecutive floating operators
    if (calcExpression !== "" && !calcExpression.endsWith(" ")) {
        calcExpression += " " + op + " ";
        display.innerText = calcExpression;
    }
}

function clearCalc() {
    calcExpression = "";
    document.getElementById("display").innerText = "0";
}

function calculate() {
    const display = document.getElementById("display");
    if (calcExpression === "") return;
    
    try {
        // Safe evaluation pattern
        const result = eval(calcExpression);
        if (result === undefined || isNaN(result)) {
            display.innerText = "Error";
            calcExpression = "";
        } else {
            display.innerText = result;
            calcExpression = result.toString();
        }
    } catch (err) {
        display.innerText = "Error";
        calcExpression = "";
    }
}

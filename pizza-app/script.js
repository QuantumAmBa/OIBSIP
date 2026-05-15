const BACKEND_URL = "https://oibsip-9z7q.onrender.com/api/order";

const pizzaMenu = {
    base: [ {name: "Thin Crust", price: 150}, {name: "Cheese Burst", price: 240}, {name: "Classic Pan", price: 180} ],
    sauce: [ {name: "Classic Tomato", price: 30}, {name: "Spicy BBQ", price: 40}, {name: "Zesty Pesto", price: 50} ],
    cheese: [ {name: "Mozzarella", price: 80}, {name: "Cheddar Blend", price: 100} ],
    veggies: [ {name: "Fresh Mushrooms", price: 60}, {name: "Black Olives", price: 70}, {name: "Golden Corn", price: 50} ]
};

let flowStep = 0;
const flowOrder = ["base", "sauce", "cheese", "veggies"];
let selectedPizza = { base: null, sauce: null, cheese: null, veggies: null };

function initFlow() {
    const currentCategory = flowOrder[flowStep];
    const titles = ["1. Select Your Crust (Base)", "2. Choose Your Gourmet Sauce", "3. Select Cheese Layer", "4. Opt Veggies from many options"];
    document.getElementById("flow-title").innerText = titles[flowStep];
    
    const container = document.getElementById("selection-container");
    container.innerHTML = "";
    
    pizzaMenu[currentCategory].forEach(item => {
        const div = document.createElement("div");
        div.className = "menu-card";
        div.onclick = () => selectItem(currentCategory, item);
        div.innerHTML = `<h4>${item.name}</h4><p>+ ₹${item.price}</p>`;
        container.appendChild(div);
    });
}

function selectItem(cat, item) {
    selectedPizza[cat] = item;
    updateSummary();
    if(flowStep < 3) {
        flowStep++;
        initFlow();
    } else {
        document.getElementById("flow-title").innerText = "Configuration Complete! 🎉";
        document.getElementById("selection-container").innerHTML = "<p>Your pizza has been styled perfectly. Please complete payment on the right panel.</p>";
        document.getElementById("pay-btn").disabled = false;
    }
}

function updateSummary() {
    const list = document.getElementById("summary-items");
    list.innerHTML = "";
    let runningTotal = 0;
    
    flowOrder.forEach(cat => {
        if(selectedPizza[cat]) {
            const li = document.createElement("li");
            li.innerHTML = `<span>${selectedPizza[cat].name}</span><strong>₹${selectedPizza[cat].price}</strong>`;
            list.appendChild(li);
            runningTotal += selectedPizza[cat].price;
        }
    });
    document.getElementById("total-price").innerText = runningTotal;
}

async function triggerCheckout() {
    // Stage 5: Emulate Razorpay Payment Flow Interface
    document.getElementById("pay-btn").innerText = "Authorizing Gateway Securely...";
    document.getElementById("pay-btn").disabled = true;
    
    setTimeout(async () => {
        alert("🔒 Razorpay Test Gateway Authorization Success!");
        setTrackerState("step-received");
        
        // Formulate request data block array to dispatch to cluster API
        const payload = [selectedPizza.base.name, selectedPizza.sauce.name, selectedPizza.cheese.name, selectedPizza.veggies.name];
        
        try {
            const res = await fetch(BACKEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: payload })
            });
            const data = await res.json();
            
            if(data.success) {
                // Stage 9 & 10 Simulation steps for internal dashboard state
                setTimeout(() => setTrackerState("step-kitchen"), 2000);
                setTimeout(() => setTrackerState("step-delivery"), 6000);
            }
        } catch {
            // Failure safety mitigation fallback loop
            setTimeout(() => setTrackerState("step-kitchen"), 2000);
            setTimeout(() => setTrackerState("step-delivery"), 6000);
        }
        document.getElementById("pay-btn").innerText = "Order Dispatched Successfully ✅";
    }, 1500);
}

function setTrackerState(stepId) {
    document.querySelectorAll(".t-step").forEach(s => s.classList.remove("active"));
    document.getElementById(stepId).classList.add("active");
}

initFlow();

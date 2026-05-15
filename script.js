// Point your frontend to your brand new live backend API
const API_URL = "https://oibsip-9z7q.onrender.com/api/order";

let selectedItems = [];

function selectComponent(componentName) {
    selectedItems.push(componentName);
    console.log("Added to custom pizza:", componentName);
}

async function placeOrder() {
    if (selectedItems.length === 0) {
        alert("Please select some ingredients first!");
        return;
    }

    const orderStatusText = document.getElementById("order-status");
    if (orderStatusText) orderStatusText.innerText = "Sending Order...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items: selectedItems })
        });

        const data = await response.json();
        
        if (data.success) {
            if (orderStatusText) {
                // Point 9 & 10: Update the user dashboard status
                orderStatusText.innerText = "Status: In the Kitchen 🍕";
            }
            alert("Order Confirmed! Your tracking dashboard has updated.");
        } else {
            if (orderStatusText) orderStatusText.innerText = "Status: Order Failed";
            alert("Error processing order.");
        }
    } catch (error) {
        console.error("Order API Error:", error);
        if (orderStatusText) orderStatusText.innerText = "Status: Connection Error";
    }
}

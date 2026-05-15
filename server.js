const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

console.log("Starting server diagnostics...");

// Safe connection handling with logs
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Successfully connected to MongoDB Atlas!"))
  .catch((err) => {
    console.error("❌ MONGODB CONNECTION ERROR:", err.message);
  });

// Schema definition for Inventory Tracking (Points 6 & 7)
const Inventory = mongoose.model('Inventory', new mongoose.Schema({
    name: String,
    category: { type: String, enum: ['base', 'sauce', 'cheese', 'veggies'] },
    stock: { type: Number, default: 50 },
    threshold: { type: Number, default: 20 }
}));

// Mail setup for Low Stock Alerts (Point 8)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.ADMIN_EMAIL, pass: process.env.EMAIL_PASS }
});

// Main Order Processing Endpoint (Points 7, 8, & 9)
app.post('/api/order', async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, message: "Invalid items format" });
        }

        for (let itemName of items) {
            const item = await Inventory.findOneAndUpdate(
                { name: itemName },
                { $inc: { stock: -1 } },
                { new: true }
            );
            if (item && item.stock < item.threshold) {
                transporter.sendMail({
                    to: process.env.ADMIN_EMAIL,
                    subject: '🚨 LOW STOCK ALERT',
                    text: `${item.name} is down to ${item.stock}. Please refill.`
                });
            }
        }
        res.json({ success: true, status: "Order Received" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => res.send("🍕 Pizza Backend Engine is fully operational!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server live on port ${PORT}`));

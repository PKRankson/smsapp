const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Set up the Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Middleware to parse JSON bodies
app.use(express.json());

// Define the endpoint that receives SMS delivery status
app.post('/', (req, res) => {
    const deliveryStatus = req.body;
    console.log('Delivery status received:', deliveryStatus);

    // Forward the delivery status to all WebSocket clients (e.g., React frontend)
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(deliveryStatus));
        }
    });

    // Respond to the request to confirm receipt of the status
    res.status(200).send('Callback received');
});

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');

    ws.on('message', (message) => {
        console.log('Message from client:', message);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

// Start the HTTP and WebSocket server
server.listen(8000, () => {
    console.log('Backend server listening on port 8000');
});

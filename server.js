const path = require("path");
const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const app = express();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const wsServer = new WebSocket.Server({ server });

let connectedClients = [];

wsServer.on("connection", (ws) => {
    console.log("Client connected");
    connectedClients.push(ws);
    ws.on("message", (data) => {
        connectedClients.forEach((client, i) => {
            if (connectedClients[i] === client && client.readyState === client.OPEN) {
                client.send(data);
            } else {
                connectedClients.splice(i, 1);
            }
        });
    });

    ws.on("close", () => {
        connectedClients = connectedClients.filter(client => client !== ws);
    });
});
app.get("/client", (req, res) => res.sendFile(path.resolve(__dirname, "./client.html")));

server.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});

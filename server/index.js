import express from "express";
import cors from "cors";
import "dotenv/config";
import { createServer } from 'http';
import { setupSocket } from './socketServer.js';
import notesRoutes from "./routes/notesRoutes.js";
import tagsRoutes from "./routes/tagsRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/notes', notesRoutes);
app.use('/tags', tagsRoutes);
app.use('/tasks', tasksRoutes);

// Setup WebSocket
setupSocket(httpServer);

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`🚌 Server running on port ${PORT}`);
});

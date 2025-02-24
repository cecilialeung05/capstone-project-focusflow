import { Server } from 'socket.io';

export function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected');

        // Listen for task updates
        socket.on('taskUpdate', (task) => {
            io.emit('taskUpdated', task);
        });

        // Listen for note updates
        socket.on('noteUpdate', (note) => {
            io.emit('noteUpdated', note);
        });

        // Listen for tag updates
        socket.on('tagUpdate', (tag) => {
            io.emit('tagUpdated', tag);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
}

export default setupSocket;
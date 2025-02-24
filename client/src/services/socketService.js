import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        this.socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    subscribeToUpdates(callback) {
        this.socket.on('taskUpdated', (task) => callback('task', task));
        this.socket.on('noteUpdated', (note) => callback('note', note));
        this.socket.on('tagUpdated', (tag) => callback('tag', tag));
    }


    emitTaskUpdate(task) {
        this.socket.emit('taskUpdate', task);
    }

    emitNoteUpdate(note) {
        this.socket.emit('noteUpdate', note);
    }

    emitTagUpdate(tag) {
        this.socket.emit('tagUpdate', tag);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export const socketService = new SocketService();
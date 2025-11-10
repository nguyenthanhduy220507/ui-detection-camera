import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3333';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(WS_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('✅ WebSocket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ WebSocket disconnected');
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  startStream(cameraId: string) {
    if (this.socket) {
      this.socket.emit('startStream', { cameraId });
    }
  }

  stopStream(cameraId: string) {
    if (this.socket) {
      this.socket.emit('stopStream', { cameraId });
    }
  }

  onFrame(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('frame', callback);
    }
  }

  onAlert(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('alert', callback);
    }
  }

  offFrame() {
    if (this.socket) {
      this.socket.off('frame');
    }
  }

  offAlert() {
    if (this.socket) {
      this.socket.off('alert');
    }
  }
}

export const socketService = new SocketService();


import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import axios from 'axios';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class StreamGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(StreamGateway.name);
  private activeStreams: Map<string, any> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Clean up any streams associated with this client
    this.activeStreams.forEach((stream, key) => {
      if (stream.clientId === client.id) {
        this.stopStream(key);
      }
    });
  }

  @SubscribeMessage('startStream')
  async handleStartStream(
    @MessageBody() data: { cameraId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { cameraId } = data;
    this.logger.log(`Starting stream for camera: ${cameraId}`);

    try {
      // Request Python service to start streaming
      const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';
      
      // Store stream info
      this.activeStreams.set(cameraId, {
        clientId: client.id,
        cameraId,
        startedAt: new Date(),
      });

      // Connect to Python service WebSocket and relay frames
      this.connectToPythonService(cameraId, client);

      client.emit('streamStarted', { cameraId, status: 'success' });
    } catch (error) {
      this.logger.error(`Failed to start stream for camera ${cameraId}:`, error);
      client.emit('streamError', { cameraId, error: error.message });
    }
  }

  @SubscribeMessage('stopStream')
  handleStopStream(
    @MessageBody() data: { cameraId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { cameraId } = data;
    this.logger.log(`Stopping stream for camera: ${cameraId}`);
    this.stopStream(cameraId);
    client.emit('streamStopped', { cameraId });
  }

  private async connectToPythonService(cameraId: string, client: Socket) {
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';
    
    // In a real implementation, you would establish a WebSocket connection
    // to the Python service and relay frames. For now, we'll use polling.
    const streamInterval = setInterval(async () => {
      try {
        const response = await axios.get(
          `${pythonServiceUrl}/stream/${cameraId}/frame`,
          { timeout: 5000 }
        );
        
        if (response.data && response.data.frame) {
          client.emit('frame', {
            cameraId,
            frame: response.data.frame,
            timestamp: response.data.timestamp,
          });
        }
      } catch (error) {
        this.logger.error(`Error fetching frame for camera ${cameraId}:`, error.message);
      }
    }, 100); // 10 FPS

    // Store interval for cleanup
    const stream = this.activeStreams.get(cameraId);
    if (stream) {
      stream.interval = streamInterval;
    }
  }

  private stopStream(cameraId: string) {
    const stream = this.activeStreams.get(cameraId);
    if (stream && stream.interval) {
      clearInterval(stream.interval);
    }
    this.activeStreams.delete(cameraId);
  }

  // Method to emit alerts to all connected clients
  emitAlert(alert: any) {
    this.server.emit('alert', alert);
  }
}


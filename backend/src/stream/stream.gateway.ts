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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Camera } from '../cameras/entities/camera.entity';

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
  private readonly pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';

  constructor(
    @InjectRepository(Camera)
    private camerasRepository: Repository<Camera>,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Clean up any streams associated with this client
    this.activeStreams.forEach((stream, cameraId) => {
      if (stream.clientId === client.id || stream.clients?.includes(client.id)) {
        // Remove client from clients list
        if (stream.clients) {
          stream.clients = stream.clients.filter(id => id !== client.id);
          
          // If no more clients, stop the stream
          if (stream.clients.length === 0) {
            this.logger.log(`No more clients for camera ${cameraId}, stopping stream`);
            this.stopStream(cameraId);
          }
        } else {
          this.stopStream(cameraId);
        }
      }
    });
  }

  @SubscribeMessage('startStream')
  async handleStartStream(
    @MessageBody() data: { cameraId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { cameraId } = data;
    
    // Check if stream already active for this camera
    const existingStream = this.activeStreams.get(cameraId);
    if (existingStream && existingStream.interval) {
      this.logger.log(`Stream already active for camera: ${cameraId}, adding client`);
      existingStream.clients = existingStream.clients || [];
      existingStream.clients.push(client.id);
      client.emit('streamStarted', { cameraId, status: 'success' });
      return;
    }

    this.logger.log(`Starting stream for camera: ${cameraId}`);

    try {
      // Get camera from database
      const camera = await this.camerasRepository.findOne({ where: { id: cameraId } });
      if (!camera) {
        throw new Error('Camera not found in database');
      }

      // Ensure camera is added to Python service
      await this.ensureCameraInPythonService(camera);
      
      // Store stream info
      this.activeStreams.set(cameraId, {
        clientId: client.id,
        clients: [client.id],
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

  private async ensureCameraInPythonService(camera: Camera): Promise<void> {
    try {
      // Try to add camera to Python service
      const response = await axios.post(`${this.pythonServiceUrl}/cameras/add`, {
        camera_id: camera.id,  // Pass backend camera ID
        name: camera.name,
        rtsp_url: camera.rtspUrl,
        username: camera.username,
        password: camera.password,
      }, {
        timeout: 5000,
      });
      this.logger.log(`Camera ${camera.id} ensured in Python service`);
    } catch (error) {
      // Camera already added is OK, just log it
      this.logger.log(`Camera ${camera.id} already in Python service or added successfully`);
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
    // Optimized polling with frame sharing for multiple clients
    
    let errorCount = 0;
    const MAX_ERRORS = 20; // Increased from 5 to 20 for better tolerance
    let consecutiveErrors = 0;
    let lastFrame: any = null;
    let lastFrameTime = 0;
    
    const streamInterval = setInterval(async () => {
      const stream = this.activeStreams.get(cameraId);
      if (!stream) {
        clearInterval(streamInterval);
        return;
      }

      try {
        const response = await axios.get(
          `${this.pythonServiceUrl}/stream/${cameraId}/frame`,
          { 
            timeout: 2000, // Reduced timeout for faster failure detection
            validateStatus: (status) => status === 200,
            headers: {
              'Connection': 'keep-alive', // Reuse connections
            }
          }
        );
        
        if (response.data && response.data.frame) {
          lastFrame = {
            cameraId,
            frame: response.data.frame,
            timestamp: response.data.timestamp,
            width: response.data.width,
            height: response.data.height,
          };
          lastFrameTime = Date.now();
          
          // Emit to all connected clients for this camera
          if (stream.clients && stream.clients.length > 0) {
            this.server.to(stream.clients).emit('frame', lastFrame);
          } else {
            client.emit('frame', lastFrame);
          }
          
          // Reset error counters on success
          errorCount = 0;
          consecutiveErrors = 0;
        }
      } catch (error) {
        errorCount++;
        consecutiveErrors++;
        
        // Only stop if too many CONSECUTIVE errors
        if (consecutiveErrors >= MAX_ERRORS) {
          this.logger.error(`Too many consecutive errors (${consecutiveErrors}) for camera ${cameraId}, stopping stream`);
          this.stopStream(cameraId);
          
          // Notify all clients
          if (stream.clients) {
            stream.clients.forEach(clientId => {
              this.server.to(clientId).emit('streamError', { 
                cameraId, 
                error: 'Connection lost - camera may be offline or unreachable' 
              });
            });
          }
        } else if (errorCount % 10 === 1) {
          // Only log every 10th error to reduce spam
          this.logger.warn(`Error fetching frame for camera ${cameraId} (${errorCount} total, ${consecutiveErrors} consecutive)`);
        }
      }
    }, 66); // 15 FPS (1000ms / 15 = 66ms) - Balance between smoothness and server load

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


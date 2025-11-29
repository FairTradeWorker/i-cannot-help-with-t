// Real-time Service
// WebSocket connections for live updates

interface RealtimeCallback {
  (data: any): void;
}

export class RealtimeService {
  private ws: WebSocket | null = null;
  private callbacks: Map<string, RealtimeCallback[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  /**
   * Connect to WebSocket server
   */
  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.attemptReconnect(url);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(url: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
        this.connect(url).catch(() => {
          // Reconnection will be attempted again
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(data: any) {
    const { type, payload } = data;

    // Call all registered callbacks for this message type
    const callbacks = this.callbacks.get(type);
    if (callbacks) {
      callbacks.forEach(callback => callback(payload));
    }
  }

  /**
   * Subscribe to a message type
   */
  subscribe(type: string, callback: RealtimeCallback): () => void {
    if (!this.callbacks.has(type)) {
      this.callbacks.set(type, []);
    }

    const callbacks = this.callbacks.get(type)!;
    callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Send message to server
   */
  send(type: string, payload: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected. Message not sent:', type);
    }
  }

  /**
   * Disconnect
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.callbacks.clear();
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const realtimeService = new RealtimeService();


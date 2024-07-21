// websocket.service.ts
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messagesSubject = new Subject<string>();

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = new WebSocket('ws://localhost:8080');

    this.socket.onmessage = (event) => {
      this.messagesSubject.next(event.data);
    };

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  sendMessage(message: any): void {
    if (this.socket) {
      const serializedMessage = JSON.stringify(message); // Serialize the message
      this.socket.send(serializedMessage);
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  get messages$(): Observable<string> {
    return this.messagesSubject.asObservable();
  }
}

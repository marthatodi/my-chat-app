// chat.component.ts
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: string[] = [];
  currentMessage: string = '';

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.messages$.subscribe({
      next: (message: string) => {
        try {
          const data = JSON.parse(message); // Deserialize the JSON string
          this.currentMessage += data.message; // Append chunk to current message
          // Optionally, push to messages array if you want to display multiple messages
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      },
      error: (err: any) => console.error('WebSocket error:', err),
      complete: () => console.log('WebSocket connection closed'),
    });
  }

  sendMessage(content: string): void {
    if (content && content.trim()) {
      const message = { content: content.trim() }; // Create message object
      this.webSocketService.sendMessage(message); // Send message
      this.currentMessage = ''; // Clear current message
    } else {
      console.error('Message content cannot be empty');
    }
  }
}

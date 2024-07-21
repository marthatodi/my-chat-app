// src/app/chat/chat.component.ts
import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: string[] = [];
  inputMessage: string = '';

  constructor(private websocketService: WebsocketService) { }

  ngOnInit() {
   // this.websocketService = this.websocketService.connect();

    this.websocketService.getMessages().subscribe(message => {
      console.log(message);

      this.messages.push(message.message);
      
    });
  }


  sendMessage() {
    if (this.inputMessage) {
      console.log(this.inputMessage);
      
      this.websocketService.sendMessage(this.inputMessage);
      this.inputMessage = '';
    }
  }
}

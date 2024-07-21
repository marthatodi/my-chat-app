// src/app/websocket.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class WebsocketService {
private socket$: WebSocketSubject<any>;

constructor() {
this.socket$ = webSocket('ws://localhost:8080'); // Replace with your WebSocket server URL
}

sendMessage(message: any) {
const serializedMessage = JSON.stringify(message);
console.log(serializedMessage);
// Serialize the message
this.socket$.next(serializedMessage);
}

getMessages(): Observable<any> {
return this.socket$.asObservable();
}
}


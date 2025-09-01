import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  message: string;
  timestamp: Date;
  isUser: boolean;
}

export interface ChatResponse {
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${environment.aiApiUrl}/chat/gemini`, { message });
  }
}
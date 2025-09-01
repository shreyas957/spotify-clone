import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService, ChatMessage } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chatbot-container preserve-spaces">
      <button class="chatbot-toggle" (click)="toggleChat()">
        <svg *ngIf="!isOpen" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
        <svg *ngIf="isOpen" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>

      <div *ngIf="isOpen" class="chat-window">
        <div class="chat-header">
          <h3>Music Assistant</h3>
          <button class="close-button" (click)="toggleChat()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div class="chat-messages" #messagesContainer>
          <div 
            *ngFor="let message of messages; trackBy: trackByMessage" 
            class="message"
            [class.user-message]="message.isUser"
            [class.bot-message]="!message.isUser"
          >
            <div class="message-content">
              {{ message.message }}
            </div>
            <div class="message-time">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
          
          <div *ngIf="isTyping" class="message bot-message">
            <div class="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div class="chat-input-container">
          <input 
            type="text" 
            [(ngModel)]="currentMessage"
            (keyup.enter)="sendMessage()"
            placeholder="Ask me about music..."
            class="chat-input"
            [disabled]="isTyping"
          >
          <button 
            class="send-button"
            (click)="sendMessage()"
            [disabled]="!currentMessage.trim() || isTyping"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .preserve-spaces {
      white-space: pre-wrap;   /* or pre, pre-line */
    }
    
    .chatbot-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
    }

    .chatbot-toggle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #1db954;
      color: #000;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(29, 185, 84, 0.4);
      transition: all 0.3s ease;
    }

    .chatbot-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(29, 185, 84, 0.6);
    }

    .chat-window {
      position: absolute;
      bottom: 72px;
      right: 0;
      width: 350px;
      height: 500px;
      background-color: #282828;
      border-radius: 12px;
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease-out;
    }

    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #404040;
    }

    .chat-header h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: #fff;
    }

    .close-button {
      background: none;
      border: none;
      color: #b3b3b3;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      color: #fff;
      background-color: rgba(255, 255, 255, 0.1);
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message {
      display: flex;
      flex-direction: column;
      max-width: 80%;
    }

    .user-message {
      align-self: flex-end;
    }

    .bot-message {
      align-self: flex-start;
    }

    .message-content {
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.4;
    }

    .user-message .message-content {
      background-color: #1db954;
      color: #000;
    }

    .bot-message .message-content {
      background-color: #404040;
      color: #fff;
    }

    .message-time {
      font-size: 11px;
      color: #727272;
      margin-top: 4px;
      padding: 0 8px;
    }

    .user-message .message-time {
      text-align: right;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 16px !important;
    }

    .typing-indicator span {
      width: 6px;
      height: 6px;
      background-color: #b3b3b3;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.5;
      }
      30% {
        transform: translateY(-10px);
        opacity: 1;
      }
    }

    .chat-input-container {
      display: flex;
      gap: 8px;
      padding: 16px;
      border-top: 1px solid #404040;
    }

    .chat-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #404040;
      border-radius: 20px;
      background-color: #121212;
      color: #fff;
      font-size: 14px;
      transition: border-color 0.2s ease;
    }

    .chat-input:focus {
      outline: none;
      border-color: #1db954;
    }

    .chat-input:disabled {
      opacity: 0.5;
    }

    .send-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #1db954;
      color: #000;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .send-button:hover:not(:disabled) {
      background-color: #1ed760;
      transform: scale(1.05);
    }

    .send-button:disabled {
      background-color: #404040;
      color: #727272;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .chat-window {
        width: 300px;
        height: 400px;
      }
    }
  `]
})
export class ChatbotComponent {
  isOpen = false;
  messages: ChatMessage[] = [];
  currentMessage = '';
  isTyping = false;

  constructor(private chatService: ChatService, 
    private authService: AuthService,
    private router: Router
  ) {
    // Add welcome message
    this.messages.push({
      message: "Hi! I'm your music assistant. Ask me anything about music, artists, or recommendations!",
      timestamp: new Date(),
      isUser: false
    });
  }

  toggleChat(): void {
    if (!this.authService.isAuthenticated()) {
      // Redirect if not logged in
      this.router.navigate(['/auth/login']);
      return;
    }
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isTyping) return;

    // Add user message
    this.messages.push({
      message: this.currentMessage,
      timestamp: new Date(),
      isUser: true
    });

    const userMessage = this.currentMessage;
    this.currentMessage = '';
    this.isTyping = true;

    // Send to chat service
    this.chatService.sendMessage(userMessage).subscribe({
      next: (response) => {
        this.messages.push({
          message: response.response,
          timestamp: new Date(),
          isUser: false
        });
        this.isTyping = false;
      },
      error: (error) => {
        this.messages.push({
          message: "Sorry, I'm having trouble responding right now. Please try again later.",
          timestamp: new Date(),
          isUser: false
        });
        this.isTyping = false;
      }
    });
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  trackByMessage(index: number, message: ChatMessage): string {
    return `${message.timestamp.getTime()}-${message.isUser}`;
  }
}
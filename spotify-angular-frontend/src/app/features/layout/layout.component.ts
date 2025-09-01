import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent, ChatbotComponent],
  template: `
    <div class="layout-container">
      <app-sidebar class="sidebar"></app-sidebar>
      <div class="main-content">
        <app-topbar class="topbar"></app-topbar>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-chatbot></app-chatbot>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      height: 100vh;
      background-color: #000;
    }

    .sidebar {
      width: 240px;
      flex-shrink: 0;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .topbar {
      height: 64px;
      flex-shrink: 0;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      background: linear-gradient(180deg, #1db954 0%, #121212 300px);
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 72px;
      }
    }
  `]
})
export class LayoutComponent {}
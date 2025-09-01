import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('slideAnimation', [
      state('view', style({ transform: 'translateX(0%)', opacity: 1 })),
      state('edit', style({ transform: 'translateX(-100%)', opacity: 0 })),
      transition('view => edit', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('edit => view', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms cubic-bezier(0.25, 0.8, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header" @fadeInUp>
        <div class="profile-avatar">
          <div class="avatar-circle">
            {{ currentUser?.name?.charAt(0)?.toUpperCase() || 'U' }}
          </div>
        </div>
        <div class="profile-info">
          <p class="profile-type">Profile</p>
          <h1 class="profile-name">{{ currentUser?.name }}</h1>
          <div class="profile-meta">
            <span class="profile-email">{{ currentUser?.email }}</span>
            <span class="separator">•</span>
            <span class="member-since">Member since {{ getMemberSince() }}</span>
          </div>
        </div>
      </div>

      <!-- Profile Actions -->
      <div class="profile-actions" @fadeInUp>
        <button 
          *ngIf="!isEditing" 
          class="btn btn-primary edit-button"
          (click)="startEditing()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          Edit Profile
        </button>
        <button 
          *ngIf="isEditing" 
          class="btn btn-secondary cancel-button"
          (click)="cancelEditing()">
          Cancel
        </button>
      </div>

      <!-- Profile Content Container -->
      <div class="profile-content">
        <!-- View Mode -->
        <div 
          class="profile-view"
          [@slideAnimation]="isEditing ? 'edit' : 'view'"
          *ngIf="!isEditing || isTransitioning">
          <div class="profile-details">
            <h2>Personal Information</h2>
            <div class="detail-grid">
              <div class="detail-item">
                <label class="detail-label">Full Name</label>
                <p class="detail-value">{{ currentUser?.name }}</p>
              </div>
              <div class="detail-item">
                <label class="detail-label">Email Address</label>
                <p class="detail-value">{{ currentUser?.email }}</p>
              </div>
              <div class="detail-item">
                <label class="detail-label">Date of Birth</label>
                <p class="detail-value">{{ formatDate(currentUser?.dateOfBirth) }}</p>
              </div>
              <div class="detail-item">
                <label class="detail-label">Gender</label>
                <p class="detail-value">{{ formatGender(currentUser?.gender) }}</p>
              </div>
              <div class="detail-item">
                <label class="detail-label">Country</label>
                <p class="detail-value">{{ currentUser?.country || 'Not specified' }}</p>
              </div>
              <div class="detail-item">
                <label class="detail-label">Member Since</label>
                <p class="detail-value">{{ getMemberSince() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Mode -->
        <div 
          class="profile-edit"
          [@slideAnimation]="isEditing ? 'view' : 'edit'"
          *ngIf="isEditing || isTransitioning">
          
          <!-- Password Verification Step -->
          <div *ngIf="!passwordVerified" class="password-verification">
            <div class="verification-header">
              <h2>Verify Your Password</h2>
              <p>Please enter your current password to continue editing your profile.</p>
            </div>
            
            <form [formGroup]="passwordForm" (ngSubmit)="verifyPassword()" class="verification-form">
              <div class="form-group">
                <label class="form-label">Current Password</label>
                <div class="password-input-container">
                  <input 
                    [type]="showCurrentPassword ? 'text' : 'password'"
                    formControlName="currentPassword" 
                    class="form-input"
                    [class.error]="passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched"
                    placeholder="Enter your current password"
                  >
                  <button 
                    type="button" 
                    class="password-toggle"
                    (click)="toggleCurrentPasswordVisibility()">
                    <svg *ngIf="!showCurrentPassword" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    <svg *ngIf="showCurrentPassword" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  </button>
                </div>
                <div *ngIf="passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched" class="error-message">
                  Current password is required
                </div>
                <div *ngIf="passwordError" class="error-message">
                  {{ passwordError }}
                </div>
              </div>

              <button 
                type="submit" 
                class="btn btn-primary verify-button"
                [disabled]="passwordForm.invalid || isVerifying">
                <div *ngIf="isVerifying" class="loading-spinner"></div>
                <span *ngIf="!isVerifying">Verify Password</span>
              </button>
            </form>
          </div>

          <!-- Profile Edit Form -->
          <div *ngIf="passwordVerified" class="edit-form-container">
            <div class="edit-header">
              <h2>Edit Profile</h2>
              <p>Update your personal information below.</p>
            </div>

            <form [formGroup]="editForm" (ngSubmit)="saveProfile()" class="edit-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input 
                    type="text" 
                    formControlName="name" 
                    class="form-input"
                    [class.error]="editForm.get('name')?.invalid && editForm.get('name')?.touched"
                    placeholder="Enter your full name"
                    maxlength="50"
                  >
                  <div class="input-helper">
                    <span class="char-count">{{ editForm.get('name')?.value?.length || 0 }}/50</span>
                  </div>
                  <div *ngIf="editForm.get('name')?.invalid && editForm.get('name')?.touched" class="error-message">
                    <span *ngIf="editForm.get('name')?.errors?.['required']">Name is required</span>
                    <span *ngIf="editForm.get('name')?.errors?.['minlength']">Name must be at least 2 characters</span>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input 
                    type="email" 
                    formControlName="email" 
                    class="form-input"
                    [class.error]="editForm.get('email')?.invalid && editForm.get('email')?.touched"
                    placeholder="Enter your email address"
                  >
                  <div *ngIf="editForm.get('email')?.invalid && editForm.get('email')?.touched" class="error-message">
                    <span *ngIf="editForm.get('email')?.errors?.['required']">Email is required</span>
                    <span *ngIf="editForm.get('email')?.errors?.['email']">Please enter a valid email address</span>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">New Password (Optional)</label>
                  <div class="password-input-container">
                    <input 
                      [type]="showNewPassword ? 'text' : 'password'"
                      formControlName="password" 
                      class="form-input"
                      [class.error]="editForm.get('password')?.invalid && editForm.get('password')?.touched"
                      placeholder="Enter new password (leave blank to keep current)"
                    >
                    <button 
                      type="button" 
                      class="password-toggle"
                      (click)="toggleNewPasswordVisibility()">
                      <svg *ngIf="!showNewPassword" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                      <svg *ngIf="showNewPassword" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      </svg>
                    </button>
                  </div>
                  <div *ngIf="editForm.get('password')?.value" class="password-strength">
                    <div class="strength-bars">
                      <div 
                        *ngFor="let bar of [1,2,3,4]; let i = index"
                        class="strength-bar"
                        [class.weak]="passwordStrength > 0 && i === 0"
                        [class.fair]="passwordStrength > 1 && i <= 1"
                        [class.good]="passwordStrength > 2 && i <= 2"
                        [class.strong]="passwordStrength > 3 && i <= 3">
                      </div>
                    </div>
                    <span class="strength-text">{{ getPasswordStrengthText() }}</span>
                  </div>
                  <div *ngIf="editForm.get('password')?.invalid && editForm.get('password')?.touched" class="error-message">
                    <span *ngIf="editForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Date of Birth</label>
                  <input 
                    type="date" 
                    formControlName="dateOfBirth" 
                    class="form-input"
                    [class.error]="editForm.get('dateOfBirth')?.invalid && editForm.get('dateOfBirth')?.touched"
                  >
                  <div *ngIf="editForm.get('dateOfBirth')?.invalid && editForm.get('dateOfBirth')?.touched" class="error-message">
                    Date of birth is required
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Gender</label>
                  <div class="gender-options">
                    <label 
                      *ngFor="let option of genderOptions" 
                      class="gender-option"
                      [class.selected]="editForm.get('gender')?.value === option.value">
                      <input 
                        type="radio" 
                        [value]="option.value" 
                        formControlName="gender"
                        class="gender-radio">
                      <span class="gender-label">{{ option.label }}</span>
                    </label>
                  </div>
                  <div *ngIf="editForm.get('gender')?.invalid && editForm.get('gender')?.touched" class="error-message">
                    Please select your gender
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Country</label>
                  <input 
                    type="text" 
                    formControlName="country" 
                    class="form-input"
                    placeholder="Enter your country (optional)"
                  >
                </div>
              </div>

              <div *ngIf="updateError" class="error-message global-error">
                {{ updateError }}
              </div>

              <div *ngIf="updateSuccess" class="success-message">
                Profile updated successfully!
              </div>

              <div class="form-actions">
                <button 
                  type="button" 
                  class="btn btn-secondary cancel-button"
                  (click)="cancelEditing()">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary save-button"
                  [disabled]="editForm.invalid || isUpdating">
                  <div *ngIf="isUpdating" class="loading-spinner"></div>
                  <span *ngIf="!isUpdating">Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 32px;
      max-width: 800px;
      margin: 0 auto;
      animation: fadeIn 0.5s ease-out;
    }

    .profile-header {
      display: flex;
      gap: 32px;
      margin-bottom: 32px;
      align-items: end;
    }

    .profile-avatar {
      flex-shrink: 0;
    }

    .avatar-circle {
      width: 232px;
      height: 232px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1db954, #1ed760);
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 80px;
      font-weight: 700;
      box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
    }

    .profile-info {
      flex: 1;
    }

    .profile-type {
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      margin: 0 0 8px;
      text-transform: uppercase;
    }

    .profile-name {
      font-size: 48px;
      font-weight: 900;
      margin: 0 0 24px;
      line-height: 1.1;
    }

    .profile-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #b3b3b3;
    }

    .profile-email {
      color: #fff;
      font-weight: 500;
    }

    .separator {
      color: #727272;
    }

    .profile-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }

    .edit-button {
      padding: 12px 24px;
      font-size: 16px;
    }

    .profile-content {
      position: relative;
      min-height: 500px;
      overflow: auto;
    }

    .profile-view,
    .profile-edit {
      position: relative;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
    }

    .profile-details h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 24px;
      color: #fff;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .detail-item {
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 20px;
      transition: background-color 0.2s ease;
    }

    .detail-item:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }

    .detail-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #b3b3b3;
      text-transform: uppercase;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 16px;
      font-weight: 500;
      color: #fff;
      margin: 0;
    }

    .password-verification {
      max-width: 400px;
      margin: 0 auto;
      text-align: center;
    }

    .verification-header {
      margin-bottom: 32px;
    }

    .verification-header h2 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 12px;
      color: #fff;
    }

    .verification-header p {
      font-size: 16px;
      color: #b3b3b3;
      margin: 0;
    }

    .verification-form {
      text-align: left;
    }

    .edit-form-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .edit-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .edit-header h2 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 12px;
      color: #fff;
    }

    .edit-header p {
      font-size: 16px;
      color: #b3b3b3;
      margin: 0;
    }

    .form-row {
      margin-bottom: 24px;
    }

    .form-group {
      position: relative;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #fff;
      font-size: 14px;
    }

    .form-input {
      width: 100%;
      padding: 16px 20px;
      border: 2px solid #282828;
      border-radius: 8px;
      background-color: #121212;
      color: #fff;
      font-size: 16px;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .form-input:focus {
      outline: none;
      border-color: #1db954;
      background-color: #1a1a1a;
    }

    .form-input.error {
      border-color: #e22134;
    }

    .form-input::placeholder {
      color: #727272;
    }

    .input-helper {
      display: flex;
      justify-content: flex-end;
      margin-top: 4px;
    }

    .char-count {
      font-size: 12px;
      color: #727272;
    }

    .password-input-container {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #727272;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: color 0.2s ease;
    }

    .password-toggle:hover {
      color: #b3b3b3;
    }

    .password-strength {
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .strength-bars {
      display: flex;
      gap: 4px;
      flex: 1;
    }

    .strength-bar {
      height: 4px;
      flex: 1;
      background-color: #282828;
      border-radius: 2px;
      transition: background-color 0.3s ease;
    }

    .strength-bar.weak {
      background-color: #e22134;
    }

    .strength-bar.fair {
      background-color: #ff9500;
    }

    .strength-bar.good {
      background-color: #1db954;
    }

    .strength-bar.strong {
      background-color: #1ed760;
    }

    .strength-text {
      font-size: 12px;
      color: #b3b3b3;
      min-width: 60px;
    }

    .gender-options {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .gender-option {
      flex: 1;
      min-width: 120px;
      padding: 16px;
      border: 2px solid #282828;
      border-radius: 8px;
      background-color: #121212;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
      position: relative;
    }

    .gender-option:hover {
      border-color: #404040;
      background-color: #1a1a1a;
    }

    .gender-option.selected {
      border-color: #1db954;
      background-color: rgba(29, 185, 84, 0.1);
    }

    .gender-radio {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .gender-label {
      font-size: 14px;
      font-weight: 500;
      color: #fff;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 32px;
    }

    .save-button {
      flex: 2;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
    }

    .cancel-button {
      flex: 1;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
    }

    .verify-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 24px;
    }

    .error-message {
      color: #e22134;
      font-size: 12px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .global-error {
      background-color: rgba(226, 33, 52, 0.1);
      border: 1px solid #e22134;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .success-message {
      background-color: rgba(29, 185, 84, 0.1);
      border: 1px solid #1db954;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      font-size: 14px;
      color: #1db954;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #000;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .profile-container {
        padding: 20px;
      }

      .profile-header {
        flex-direction: column;
        text-align: center;
        gap: 24px;
      }

      .avatar-circle {
        width: 200px;
        height: 200px;
        font-size: 60px;
      }

      .profile-name {
        font-size: 32px;
      }

      .detail-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .form-actions {
        flex-direction: column;
      }

      .save-button,
      .cancel-button {
        flex: 1;
      }

      .gender-options {
        flex-direction: column;
      }

      .gender-option {
        min-width: auto;
      }
    }

    @media (max-width: 480px) {
      .profile-name {
        font-size: 28px;
      }

      .edit-header h2 {
        font-size: 24px;
      }

      .form-input {
        padding: 14px 16px;
        font-size: 16px; /* Prevents zoom on iOS */
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  isEditing = false;
  isTransitioning = false;
  passwordVerified = false;
  isVerifying = false;
  isUpdating = false;
  passwordError = '';
  updateError = '';
  updateSuccess = false;
  showCurrentPassword = false;
  showNewPassword = false;
  passwordStrength = 0;

  passwordForm: FormGroup;
  editForm: FormGroup;

  genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeEditForm();

    // Watch password changes for strength indicator
    this.editForm.get('password')?.valueChanges.subscribe(password => {
      this.passwordStrength = this.calculatePasswordStrength(password || '');
    });
  }

  startEditing(): void {
    this.isEditing = true;
    this.passwordVerified = false;
    this.passwordError = '';
    this.updateError = '';
    this.updateSuccess = false;
    this.passwordForm.reset();
  }

  cancelEditing(): void {
    this.isTransitioning = true;
    setTimeout(() => {
      this.isEditing = false;
      this.passwordVerified = false;
      this.isTransitioning = false;
      this.initializeEditForm();
    }, 200);
  }

  verifyPassword(): void {
    if (this.passwordForm.valid && this.currentUser) {
      this.isVerifying = true;
      this.passwordError = '';

      this.userService.verifyPassword(this.currentUser.id, this.passwordForm.value.currentPassword).subscribe({
        next: (isValid) => {
          if (isValid) {
            this.passwordVerified = true;
          } else {
            this.passwordError = 'Incorrect password. Please try again.';
          }
          this.isVerifying = false;
        },
        error: (error) => {
          this.passwordError = 'Error verifying password. Please try again.';
          this.isVerifying = false;
        }
      });
    }
  }

  saveProfile(): void {
    if (this.editForm.valid && this.currentUser) {
      this.isUpdating = true;
      this.updateError = '';
      this.updateSuccess = false;

      const updateData = { ...this.editForm.value };
      
      // Remove password if it's empty (user doesn't want to change it)
      if (!updateData.password) {
        updateData.password = this.passwordForm.value.currentPassword;
      }

      this.userService.updateProfile(this.currentUser.id, updateData).subscribe({
        next: (updatedUser) => {
          // Update the current user in auth service
          this.authService.updateCurrentUser(updatedUser);
          this.currentUser = updatedUser;
          this.updateSuccess = true;
          this.isUpdating = false;
          
          // Auto-close edit mode after successful update
          setTimeout(() => {
            this.cancelEditing();
          }, 2000);
        },
        error: (error) => {
          this.updateError = 'Failed to update profile. Please try again.';
          this.isUpdating = false;
        }
      });
    }
  }

  toggleCurrentPasswordVisibility(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  calculatePasswordStrength(password: string): number {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return Math.min(strength, 4);
  }

  getPasswordStrengthText(): string {
    switch (this.passwordStrength) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatGender(gender: string | undefined): string {
    if (!gender) return 'Not specified';
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  }

  getMemberSince(): string {
    if (!this.currentUser?.createdAt) return '';
    return new Date(this.currentUser.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  private initializeEditForm(): void {
    if (this.currentUser) {
      this.editForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email,
        password: '',
        dateOfBirth: this.currentUser.dateOfBirth,
        gender: this.currentUser.gender,
        country: this.currentUser.country || ''
      });
    }
  }
}
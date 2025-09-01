import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../../core/services/auth.service';

interface RegistrationStep {
  id: number;
  title: string;
  subtitle: string;
  completed: boolean;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  animations: [
    trigger('slideAnimation', [
      state('current', style({ transform: 'translateX(0%)', opacity: 1 })),
      state('next', style({ transform: 'translateX(100%)', opacity: 0 })),
      state('prev', style({ transform: 'translateX(-100%)', opacity: 0 })),
      transition('current => next', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('next => current', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('current => prev', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('prev => current', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms cubic-bezier(0.25, 0.8, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('progressAnimation', [
      transition('* => *', [
        animate('400ms ease-out')
      ])
    ])
  ],
  template: `
    <div class="auth-container">
      <div class="auth-card fade-in">
        <!-- Progress Indicator -->
        <div class="progress-container" @fadeInUp>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              [style.width.%]="getProgressPercentage()"
              @progressAnimation>
            </div>
          </div>
          <div class="step-indicators">
            <div 
              *ngFor="let step of steps; let i = index" 
              class="step-indicator"
              [class.active]="i <= currentStep"
              [class.current]="i === currentStep">
              <span>{{ i + 1 }}</span>
            </div>
          </div>
        </div>

        <!-- Logo Section -->
        <div class="logo-section" @fadeInUp>
          <div class="logo">
            <img width="32" height="32" viewBox="0 0 24 24" fill="currentColor" src=" https://cdn.freebiesupply.com/logos/large/2x/spotify-2-logo-png-transparent.png" alt="">
          </div>
        </div>

        <!-- Registration Steps Container -->
        <div class="steps-container">
          <!-- Step 1: Name -->
          <div 
            class="step-content"
            [@slideAnimation]="getStepState(0)"
            *ngIf="isStepVisible(0)">
            <div class="step-header">
              <h1>What's your name?</h1>
              <p>This appears on your Spotify profile.</p>
            </div>
            <form [formGroup]="nameForm" (ngSubmit)="nextStep()" class="step-form">
              <div class="form-group">
                <input 
                  type="text" 
                  formControlName="name" 
                  class="form-input"
                  [class.error]="nameForm.get('name')?.invalid && nameForm.get('name')?.touched"
                  placeholder="Enter your name"
                  maxlength="50"
                >
                <div class="input-helper">
                  <span class="char-count">{{ nameForm.get('name')?.value?.length || 0 }}/50</span>
                </div>
                <div *ngIf="nameForm.get('name')?.invalid && nameForm.get('name')?.touched" class="error-message">
                  <span *ngIf="nameForm.get('name')?.errors?.['required']">Name is required</span>
                  <span *ngIf="nameForm.get('name')?.errors?.['minlength']">Name must be at least 2 characters</span>
                </div>
              </div>
              <button 
                type="submit" 
                class="btn btn-primary step-button"
                [disabled]="nameForm.invalid">
                Next
              </button>
            </form>
          </div>

          <!-- Step 2: Email -->
          <div 
            class="step-content"
            [@slideAnimation]="getStepState(1)"
            *ngIf="isStepVisible(1)">
            <div class="step-header">
              <h1>What's your email?</h1>
              <p>You'll need to confirm this email later.</p>
            </div>
            <form [formGroup]="emailForm" (ngSubmit)="nextStep()" class="step-form">
              <div class="form-group">
                <input 
                  type="email" 
                  formControlName="email" 
                  class="form-input"
                  [class.error]="emailForm.get('email')?.invalid && emailForm.get('email')?.touched"
                  placeholder="Enter your email address"
                >
                <div *ngIf="emailForm.get('email')?.invalid && emailForm.get('email')?.touched" class="error-message">
                  <span *ngIf="emailForm.get('email')?.errors?.['required']">Email is required</span>
                  <span *ngIf="emailForm.get('email')?.errors?.['email']">Please enter a valid email address</span>
                </div>
              </div>
              <div class="step-buttons">
                <button 
                  type="button" 
                  class="btn btn-secondary back-button"
                  (click)="previousStep()">
                  Back
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary step-button"
                  [disabled]="emailForm.invalid">
                  Next
                </button>
              </div>
            </form>
          </div>

          <!-- Step 3: Password -->
          <div 
            class="step-content"
            [@slideAnimation]="getStepState(2)"
            *ngIf="isStepVisible(2)">
            <div class="step-header">
              <h1>Create a password</h1>
              <p>Use at least 6 characters.</p>
            </div>
            <form [formGroup]="passwordForm" (ngSubmit)="nextStep()" class="step-form">
              <div class="form-group">
                <div class="password-input-container">
                  <input 
                    [type]="showPassword ? 'text' : 'password'"
                    formControlName="password" 
                    class="form-input"
                    [class.error]="passwordForm.get('password')?.invalid && passwordForm.get('password')?.touched"
                    placeholder="Create a password"
                  >
                  <button 
                    type="button" 
                    class="password-toggle"
                    (click)="togglePasswordVisibility()">
                    <svg *ngIf="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    <svg *ngIf="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  </button>
                </div>
                <div class="password-strength">
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
                <div *ngIf="passwordForm.get('password')?.invalid && passwordForm.get('password')?.touched" class="error-message">
                  <span *ngIf="passwordForm.get('password')?.errors?.['required']">Password is required</span>
                  <span *ngIf="passwordForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
                </div>
              </div>
              <div class="step-buttons">
                <button 
                  type="button" 
                  class="btn btn-secondary back-button"
                  (click)="previousStep()">
                  Back
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary step-button"
                  [disabled]="passwordForm.invalid">
                  Next
                </button>
              </div>
            </form>
          </div>

          <!-- Step 4: Personal Details -->
          <div 
            class="step-content"
            [@slideAnimation]="getStepState(3)"
            *ngIf="isStepVisible(3)">
            <div class="step-header">
              <h1>Tell us about yourself</h1>
              <p>We'll use this info to personalize your experience.</p>
            </div>
            <form [formGroup]="detailsForm" (ngSubmit)="completeRegistration()" class="step-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Date of Birth</label>
                  <input 
                    type="date" 
                    formControlName="dateOfBirth" 
                    class="form-input"
                    [class.error]="detailsForm.get('dateOfBirth')?.invalid && detailsForm.get('dateOfBirth')?.touched"
                  >
                  <div *ngIf="detailsForm.get('dateOfBirth')?.invalid && detailsForm.get('dateOfBirth')?.touched" class="error-message">
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
                      [class.selected]="detailsForm.get('gender')?.value === option.value">
                      <input 
                        type="radio" 
                        [value]="option.value" 
                        formControlName="gender"
                        class="gender-radio">
                      <span class="gender-label">{{ option.label }}</span>
                    </label>
                  </div>
                  <div *ngIf="detailsForm.get('gender')?.invalid && detailsForm.get('gender')?.touched" class="error-message">
                    Please select your gender
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Country (Optional)</label>
                  <input 
                    type="text" 
                    formControlName="country" 
                    class="form-input"
                    placeholder="Enter your country"
                  >
                </div>
              </div>

              <div *ngIf="errorMessage" class="error-message global-error">
                {{ errorMessage }}
              </div>

              <div class="step-buttons">
                <button 
                  type="button" 
                  class="btn btn-secondary back-button"
                  (click)="previousStep()">
                  Back
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary step-button"
                  [disabled]="detailsForm.invalid || isLoading">
                  <div *ngIf="isLoading" class="loading-spinner"></div>
                  <span *ngIf="!isLoading">Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Footer -->
        <div class="auth-footer" @fadeInUp>
          <p>Already have an account? <a routerLink="/auth/login" class="text-primary">Log in here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1db954 0%, #191414 100%);
      padding: 20px;
    }

    .auth-card {
      background-color: #121212;
      border-radius: 16px;
      padding: 24px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      position: relative;
      overflow: hidden;
    }

    .progress-container {
      margin-bottom: 40px;
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background-color: #282828;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 24px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #1db954, #1ed760);
      border-radius: 2px;
      transition: width 0.4s ease-out;
    }

    .step-indicators {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .step-indicator {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #282828;
      color: #727272;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
      position: relative;
    }

    .step-indicator.active {
      background-color: #1db954;
      color: #000;
    }

    .step-indicator.current {
      transform: scale(1.1);
      box-shadow: 0 0 0 4px rgba(29, 185, 84, 0.2);
    }

    .logo-section {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo {
      color: #1db954;
      margin-bottom: 16px;
    }

    .logo svg {
      width: 48px;
      height: 48px;
    }

    .steps-container {
      position: relative;
      min-height: 400px;
      display: flex;
      flex-direction: column;
    }

    .step-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
    }

    .step-header {
      text-align: center;
      margin-bottom: 16px;
    }

    .step-header h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #fff;
    }

    .step-header p {
      font-size: 16px;
      color: #b3b3b3;
      margin: 0;
    }

    .step-form {
      margin-bottom: 16px;
    }

    .form-row {
      margin-bottom: 12px;
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
      padding: 10px 14px;
      border: 2px solid #282828;
      border-radius: 8px;
      background-color: #121212;
      color: #fff;
      font-size: 14px;
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
      min-width: 80px;
      padding: 10px;
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
      font-size: 12px;
      font-weight: 500;
      color: #fff;
    }

    .step-buttons {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }

    .step-button {
      flex: 2;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
    }

    .back-button {
      flex: 1;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
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

    .auth-footer {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid #282828;
      margin-top: 40px;
    }

    .auth-footer p {
      color: #b3b3b3;
      margin: 0;
      font-size: 14px;
    }

    .auth-footer a {
      color: #1db954;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
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

    /* Responsive Design */
    @media (max-width: 768px) {
      .auth-container {
        padding: 16px;
      }

      .auth-card {
        padding: 32px 24px;
      }
      
      .step-header h1 {
        font-size: 28px;
      }

      .step-buttons {
        flex-direction: column;
      }

      .step-button,
      .back-button {
        flex: 1;
        height: 40px;
        font-size: 14px;
      }

      .gender-options {
        flex-direction: column;
      }

      .gender-option {
        min-width: auto;
      }
    }

    @media (max-width: 480px) {
      .step-header h1 {
        font-size: 24px;
      }

      .form-input {
        padding: 14px 16px;
        font-size: 16px; /* Prevents zoom on iOS */
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  currentStep = 0;
  totalSteps = 4;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  passwordStrength = 0;

  steps: RegistrationStep[] = [
    { id: 1, title: 'Name', subtitle: 'What should we call you?', completed: false },
    { id: 2, title: 'Email', subtitle: 'How can we reach you?', completed: false },
    { id: 3, title: 'Password', subtitle: 'Keep your account secure', completed: false },
    { id: 4, title: 'Details', subtitle: 'Tell us about yourself', completed: false }
  ];

  genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' }
  ];

  nameForm: FormGroup;
  emailForm: FormGroup;
  passwordForm: FormGroup;
  detailsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.nameForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.detailsForm = this.fb.group({
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['']
    });
  }

  ngOnInit(): void {
    // Load saved data from localStorage if available
    this.loadSavedData();
    
    // Watch password changes for strength indicator
    this.passwordForm.get('password')?.valueChanges.subscribe(password => {
      this.passwordStrength = this.calculatePasswordStrength(password || '');
    });
  }

  getProgressPercentage(): number {
    return ((this.currentStep + 1) / this.totalSteps) * 100;
  }

  getStepState(stepIndex: number): string {
    if (stepIndex === this.currentStep) return 'current';
    if (stepIndex < this.currentStep) return 'prev';
    return 'next';
  }

  isStepVisible(stepIndex: number): boolean {
    return Math.abs(stepIndex - this.currentStep) <= 1;
  }

  nextStep(): void {
    if (this.currentStep === 0 && this.nameForm.valid) {
      this.saveStepData('name', this.nameForm.value);
      this.steps[0].completed = true;
      this.currentStep++;
    } else if (this.currentStep === 1 && this.emailForm.valid) {
      this.saveStepData('email', this.emailForm.value);
      this.steps[1].completed = true;
      this.currentStep++;
    } else if (this.currentStep === 2 && this.passwordForm.valid) {
      this.saveStepData('password', this.passwordForm.value);
      this.steps[2].completed = true;
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  completeRegistration(): void {
    if (this.detailsForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Combine all form data
      const registrationData = {
        ...this.getSavedData('name'),
        ...this.getSavedData('email'),
        ...this.getSavedData('password'),
        ...this.detailsForm.value
      };

      this.authService.register(registrationData).subscribe({
        next: () => {
          // Clear saved data
          this.clearSavedData();
          this.router.navigate(['/app/home']);
        },
        error: (error) => {
          this.errorMessage = 'Registration failed. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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

  private saveStepData(step: string, data: any): void {
    localStorage.setItem(`registration_${step}`, JSON.stringify(data));
  }

  private getSavedData(step: string): any {
    const saved = localStorage.getItem(`registration_${step}`);
    return saved ? JSON.parse(saved) : {};
  }

  private loadSavedData(): void {
    // Load saved data into forms
    const nameData = this.getSavedData('name');
    const emailData = this.getSavedData('email');
    const passwordData = this.getSavedData('password');

    if (nameData.name) {
      this.nameForm.patchValue(nameData);
      this.steps[0].completed = true;
    }

    if (emailData.email) {
      this.emailForm.patchValue(emailData);
      this.steps[1].completed = true;
    }

    if (passwordData.password) {
      this.passwordForm.patchValue(passwordData);
      this.steps[2].completed = true;
    }
  }

  private clearSavedData(): void {
    localStorage.removeItem('registration_name');
    localStorage.removeItem('registration_email');
    localStorage.removeItem('registration_password');
  }
}
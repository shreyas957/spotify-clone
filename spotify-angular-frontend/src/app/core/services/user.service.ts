import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

export interface UserCredentials {
  id: number;
  userId: number;
  email: string;
  password: string;
  createdAt: string;
  username: string;
  authorities: Array<{ authority: string }>;
  enabled: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  country?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserCredentials(userId: number): Observable<UserCredentials> {
    return this.http.get<UserCredentials>(`${environment.apiUrl}/user-credentials/user/${userId}`);
  }

  verifyPassword(userId: number, password: string): Observable<boolean> {
    return this.getUserCredentials(userId).pipe(
    switchMap(credentials =>
      this.http.post<{ valid: boolean }>(
        `${environment.apiUrl}/user-credentials/verify-password`,
        { email: credentials.email, password }
      ).pipe(
        map(response => response.valid)
      )
    )
  );
  }

  updateProfile(userId: number, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/${userId}`, userData);
  }

  // Alternative method if you create a dedicated password verification endpoint
  verifyPasswordEndpoint(userId: number, password: string): Observable<{ valid: boolean }> {
    return this.http.post<{ valid: boolean }>(`${environment.apiUrl}/users/${userId}/verify-password`, {
      password: password
    });
  }
}
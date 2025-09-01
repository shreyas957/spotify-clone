export interface User {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  country?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  date_oo_b_birth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  country?: string;
}

export interface AuthResponse {
  token: string;
  userResponseDto: User;
}
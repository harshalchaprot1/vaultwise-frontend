export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone_nos?: string[] | null;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

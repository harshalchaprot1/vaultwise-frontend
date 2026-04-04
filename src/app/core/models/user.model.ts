export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  phone_nos?: string | null;
}

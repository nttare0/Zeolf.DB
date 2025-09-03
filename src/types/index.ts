export interface User {
  id: string;
  username: string;
  password: string;
  role: 'user' | 'admin';
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface Website {
  id: string;
  name: string;
  url: string;
  logo: string;
  description: string;
}

export interface LoginSession {
  userId: string;
  loginTime: string;
  userAgent: string;
}

export interface Analytics {
  totalVisitors: number;
  loggedInUsers: number;
  loginSessions: LoginSession[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface Tab {
  id: string;
  title: string;
  url: string;
  active: boolean;
}
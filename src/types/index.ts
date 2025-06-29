
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isMember: boolean;
  isAdmin: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

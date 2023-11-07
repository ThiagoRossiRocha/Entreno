export interface User {
  _id?: any;
  token?: string;
  userName: string;
  email: string
  password: string;
  createdAt: string;
  tokenPassword?: string;
}
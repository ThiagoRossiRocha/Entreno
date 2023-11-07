export interface Profile {
  _id?: any;
  user_id: string;
  sport: string;
  category: string;
  position: string;
  fullName: string;
  email?: string;
  cpf: string;
  city: string;
  state: string;
  phoneNumber: string;
  image?: Buffer;
}
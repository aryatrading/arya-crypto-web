export interface UserType {
  email?: string | null;
  userId: number | null;
  firebaseId: string | null;
  knownKeys: [];
  subscription: boolean;
  language: string | null;
}

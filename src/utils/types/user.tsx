export interface UserState {
  email: string | null;
  userId: number | null;
  firebaseId: string | null;
  knownKeys: [];
  subscription: boolean;
}

export interface UserModel {
  uid?: string;
  name: string;
  email: string;
  dob: string;
  class: string;
  year: string;
  studentId: string;
  password: string;
  role: UserRole;
}
export interface FirebaseUser {
  apiKey: string;
  appName: string;
  createdAt: string;
  email: string;
  emailVerified: string;
  isAnonymous: string;
  lastLoginAt: string;
  uid: string;
}

export enum UserRole {
  user = 1, admin
}

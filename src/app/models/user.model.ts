export interface UserModel {
  uid?: string;
  name: string;
  email: string;
  dob: string;
  class: string;
  year: string;
  studentId: string;
  password: string;
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

import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { UserModel } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  userListRef: AngularFireList<any>;
  userRef: AngularFireObject<any>;
  constructor(
    public afs: AngularFirestore,
    private db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private router: Router,
    private alert: AlertController
    ) {}
  // Create
  // createBooking(apt: UserModel) {
  //   return this.userListRef.push({
  //     name: apt.name,
  //     studentId: apt.studentId,
  //     pass: apt.mobile,
  //   });
  // }
  // // Get Single
  // getBooking(id: string) {
  //   this.userRef = this.db.object('/appointment/' + id);
  //   return this.userRef;
  // }
  // // Get List
  // getBookingList() {
  //   this.userListRef = this.db.list('/appointment');
  //   return this.userListRef;
  // }
  // // Update
  // updateBooking(id, apt: UserModel) {
  //   return this.userRef.update({
  //     name: apt.name,
  //     email: apt.email,
  //     mobile: apt.mobile,
  //   });
  // }
  // // Delete
  // deleteBooking(id: string) {
  //   this.userRef = this.db.object('/appointment/' + id);
  //   this.userRef.remove();
  // }

 // Sign in with email/password
 signIn(email: string, password: string) {
  return this.afAuth
    .signInWithEmailAndPassword(email, password)
    .then((result) => {
      this.afAuth.authState.subscribe((user) => {
        this.router.navigate(['home/tabs/tab1']).then();
      });
    })
    .catch((error) => {
      this.showAlert(error.message);
    });
}
// Sign up with email/password
async signUp(user: UserModel) {
  console.log(user);
  return this.afAuth
    .createUserWithEmailAndPassword(user.email, user.password)
    .then((result) => {
      this.setUserData(result.user, user);
    })
    .catch((error) => {
      this.showAlert(error.message);
    });
}

async showAlert(message: string) {
  const alert = await this.alert.create({
    header: 'Alert',
    subHeader: '',
    message,
    buttons: ['OK']
  });
  await alert.present();
  const result = await alert.onDidDismiss();
}

isLoggedIn(): boolean {
  const user = JSON.parse(localStorage.getItem('user') || '');
  return user !== null && user.emailVerified !== false ? true : false;
}

setUserData(user: any, userToBeSaved: UserModel | null =null) {
  const userRef: AngularFirestoreDocument<any> = this.afs.doc(
    `users/${user.uid}`
  );

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    ...(!!userToBeSaved) && {studentId: userToBeSaved.studentId}
  };
  return userRef.set(userData, {
    merge: true,
  });
}

// Sign out
signOut() {
  return this.afAuth.signOut().then(() => {
    localStorage.removeItem('user');
    this.router.navigate(['sign-in']);
  });
}

}

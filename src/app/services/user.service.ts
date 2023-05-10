import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { FirebaseUser, UserModel } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AppService } from './app.service';
import { map, catchError } from 'rxjs/operators';
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
    private app: AppService
    ) {

    }


 // Sign in with email/password
 signIn(email: string, password: string) {
  this.app.changeLoader(true);
  return this.afAuth
    .signInWithEmailAndPassword(email, password)
    .then((result) => {
      this.app.changeLoader(false);
      localStorage.setItem('auth', JSON.stringify(result));
      this.afAuth.authState.subscribe((_user) => {
        this.router.navigate(['home/tabs/tab1']).then();
      });
    })
    .catch((error) => {
      this.app.changeLoader(false);
      this.app.showAlert(error.message);
    });
}
// Sign up with email/password
async signUp(user: UserModel) {
  this.app.changeLoader(true);
  return this.afAuth
    .createUserWithEmailAndPassword(user.email, user.password)
    .then((result) => {
      this.setUserData(result.user, user);
    })
    .catch((error) => {
      this.app.changeLoader(false);
      this.app.showAlert(error.message);
    });
}




getCurrentUser(): FirebaseUser {
  let firebaseUser = {} as FirebaseUser;
  const auth = localStorage.getItem('auth');
  if(auth) {
    firebaseUser = JSON.parse(auth).user;
  }
  return firebaseUser;
}

isLoggedIn(): boolean {
  let isLoggedIn = false;
  const auth = localStorage.getItem('auth');
  if(auth) {
    const user = JSON.parse(auth);
    isLoggedIn = user !== null;
  }
  return isLoggedIn;
}

setUserData(user: any, userToBeSaved: UserModel) {
  const userRef: AngularFirestoreDocument<any> = this.afs.doc(
    `user-collection/${user.uid}`
  );

  const userData = {
    uid: user.uid,
    ...userToBeSaved
  };
  this.app.changeLoader(false);
  return userRef.set(userData, {
    merge: true,
  });
}

// Sign out
signOut(){
  localStorage.removeItem('auth');
  this.app.changeLoader(true);
  this.afAuth.signOut().then(() => {
    this.app.changeLoader(false);
    this.router.navigate(['']);
  });
}


// Fetch Single Student Object
getUser(id: string) {
  this.app.changeLoader(true);
  return this.afs.collection('user-collection/').doc(id).valueChanges().pipe(map(data => {
    this.app.changeLoader(false);
    return data;
}),catchError(err => {
  this.app.changeLoader(false);
  this.app.showAlert(err.message);
  return err;
}));
}
// Fetch Students List
getUsersList() {
  this.userListRef = this.db.list('users-list');
  return this.userListRef;
}
// Update Student Object
updateUser(user: UserModel) {
   this.app.changeLoader(true);
  return this.afs.collection('user-collection/').doc(user.uid).update(user).then(data => {
    this.app.changeLoader(false);
    return data;
}).catch(err => {
  this.app.changeLoader(false);
  this.app.showAlert(err.message);
  return err;
});
}
// Delete Student Object
deleteUser(id: string) {
  this.userRef = this.db.object('users-list/' + id);
  this.userRef.remove();
}


getUpdateDetails() {
  this.app.changeLoader(true);
  return this.afs.collection('update-collection').snapshotChanges().pipe(map(data => {
    this.app.changeLoader(false);
    return data;
}),catchError(err => {
  this.app.changeLoader(false);
  this.app.showAlert(err.message);
  return err;
}));
}
}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AttendanceModel } from '../models/attendance.model';
import * as moment from 'moment';
import { UserService } from './user.service';
import { AppService } from './app.service';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private user: UserService,
    private app: AppService
    ) {

    }


addUserAttendanceData(attendance: AttendanceModel) {
  this.app.changeLoader(true);
 return this.afs.collection('attendance-collection').add(attendance).then(data => {
  this.app.changeLoader(false);
  return data;
}).catch(err => {
this.app.changeLoader(false);
this.app.showAlert(err.message);
return err;
});
}

updateUserAttendanceData(attendance: AttendanceModel) {
  this.app.changeLoader(true);
 return this.afs.collection('attendance-collection').doc(attendance.id).update(attendance).then(data => {
  this.app.changeLoader(false);
  return data;
}).catch(err => {
this.app.changeLoader(false);
this.app.showAlert(err.message);
return err;
});
}

getTodayAttendance() {
  this.app.changeLoader(true);
  return this.afs.collection('attendance-collection', ref =>
  ref.where('dateStamp', '==', moment().format('YYYY-MM-DD'))
  .where('userId', '==', this.user.getCurrentUser().uid)).snapshotChanges().pipe(map(data => {
      this.app.changeLoader(false);
      return data;
  }),catchError(err => {
    this.app.changeLoader(false);
    this.app.showAlert(err.message);
    return err;
  }));
}
getCurrentUserAttendances() {
  this.app.changeLoader(true);
  return this.afs.collection('attendance-collection', ref =>
  ref.where('userId', '==', this.user.getCurrentUser().uid)).valueChanges().pipe(map(data => {
    this.app.changeLoader(false);
    return data;
}),catchError(err => {
  this.app.changeLoader(false);
  this.app.showAlert(err.message);
  return err;
}));
}
getHourDetails() {
  this.app.changeLoader(true);
  return this.afs.collection('hour-colllection').valueChanges().pipe(map(data => {
    this.app.changeLoader(false);
    return data;
}),catchError(err => {
  this.app.changeLoader(false);
  this.app.showAlert(err.message);
  return err;
}));
}
}

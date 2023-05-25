import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { AttendanceModel } from '../models/attendance.model';
import * as moment from 'moment';
import { UserService } from '../services/user.service';
import { AppService } from '../services/app.service';

import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { UserRole } from '../models/user.model';
import { Router } from '@angular/router';

interface HourDetail {
  endTime: number;
  enumValue: TimeEnum;
  startTime: number;
  time: string;
}
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  todayAttendance: AttendanceModel;
  hourDetails: HourDetail[] = [];
  currentTime = TimeEnum.none;
  timeEnum = TimeEnum;
  loggedBoth = false;
  locationDistance = 0;
  buttonClicked = false;

  constructor(
    private readonly attendance: AttendanceService,
    private readonly user: UserService,
    private readonly auth: UserService,
    private readonly app: AppService,
    private readonly router: Router
  ) {

  }

  ngOnInit() {

  }

  ionViewDidEnter(): void {
    if(this.user.getCurrentUserRole() === UserRole.admin){
      this.router.navigate(['home/tabs/admin/tab1']).then();
    }
    this.attendance.getTodayAttendance().subscribe((res: any) => {
      if (res && res.length > 0) {
        const data = res.map((item: any) => ({
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        }));
        this.todayAttendance = data[0];
        this.loggedBoth = this.todayAttendance.morning.length > 0 && this.todayAttendance.evening.length > 0;
      } else {
        this.todayAttendance = undefined;
      }
    });
    this.attendance.getHourDetails().subscribe((res: any) => {
      if (res && res.length > 0) {
        this.hourDetails = res;
        this.currentTime = this.getTime();
      }
    });
  }


  getTime = () => {
    const hour = moment().hours();
    if (this.hourDetails.length === 0) {
      return TimeEnum.none;
    }
    const morning = this.hourDetails.find(e => e.enumValue === TimeEnum.morning);
    const evening = this.hourDetails.find(e => e.enumValue === TimeEnum.evening);
    if (hour >= morning.startTime && hour <= morning.endTime) { return TimeEnum.morning; }
    else if (hour >= evening.startTime && hour <= evening.endTime) { return TimeEnum.evening; }
    else {
      return TimeEnum.none;
    }
  };
  logTodayAttendance() {
    if (this.currentTime !== TimeEnum.none) {
      const user = this.user.getUser();
      if (!this.todayAttendance) {
        this.attendance.addUserAttendanceData({
          aid: Date.now().toString(),
          userId: user.uid,
          dateStamp: moment().format('YYYY-MM-DD'),
          morning: this.currentTime === TimeEnum.morning ? moment().format('hh:mm a') : '',
          evening: this.currentTime === TimeEnum.evening ? moment().format('hh:mm a') : '',
          studentId: user.studentId,
          year: user.year,
          class: user.class,
          name: user.name,
          email: user.email,
          roomNo: user.roomNo.toString()
        }).then(res => {
          console.log(res);
          this.app.changeLoader(false);
        });
      } else {
        this.attendance.updateUserAttendanceData({
          aid: Date.now().toString(),
          id: this.todayAttendance.id,
          userId: user.uid,
          dateStamp: moment().format('YYYY-MM-DD'),
          morning: this.todayAttendance.morning.length > 0 ? this.todayAttendance.morning :
            (this.currentTime === TimeEnum.morning ? moment().format('hh:mm a') : ''),
          evening: this.todayAttendance.evening.length > 0 ? this.todayAttendance.evening :
            (this.currentTime === TimeEnum.evening ? moment().format('hh:mm a') : ''),
          studentId: user.studentId,
          year: user.year,
          class: user.class,
          name: user.name,
          email: user.email,
          roomNo: user.roomNo.toString()
        }).then(() => {
          this.app.changeLoader(false);
        }).catch(err => {
          this.app.changeLoader(false);
        });
      }
    }

  };

  checkForLocation() {
    if (!this.buttonClicked) {
      this.buttonClicked = true;
      this.app.changeLoader(true);
      const storageLocationData = localStorage.getItem('updateData');
      if (!!storageLocationData) {
        const preferredLocation: any = JSON.parse(storageLocationData);
        this.locationDistance = preferredLocation.locationDistance;
        if (preferredLocation.collegeLat && preferredLocation.collegeLong) {
          const coords = localStorage.getItem('locations');
      if (!!coords) {
            const locations: GeolocationCoordinates = JSON.parse(coords);
            this.getDistanceFromLatLonInKm(locations.latitude, locations.longitude,
              preferredLocation.collegeLat, preferredLocation.collegeLong);
          } else {
            this.app.showAlert('Please allow location, restart app and clear from background to log attendance').then();
            this.buttonClicked = false;
            this.app.changeLoader(false);
          }
        } else {
          this.app.showAlert('Something went wrong, try again after sometimes').then();
          this.buttonClicked = false;
          this.app.changeLoader(false);
        }
      } else {
        this.app.showAlert('Please enable location, restart app and clear from background to log attendance').then();
        this.app.changeLoader(false);
      }
    }
  }

  // locations distance measuring
  getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const r = 6371; // km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    lat1 = this.toRad(lat1);
    lat2 = this.toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = r * c;

    console.log('Distance between 2 points', distance);
    if (distance > this.locationDistance && this.auth.getUser().role === UserRole.user) {
      this.app.showAlert('You are outside of your college campus, You can\'t log attendance.').then();
      this.buttonClicked = false;
      this.app.changeLoader(false);

    } else {
      this.logTodayAttendance();
    }
  }

  // Converts numeric degrees to radians
  toRad(val: number) {
    return val * Math.PI / 180;
  }

}
enum TimeEnum {
  none,
  morning,
  evening
}

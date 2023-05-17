import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { AttendanceModel } from '../models/attendance.model';
import * as moment from 'moment';
import { UserService } from '../services/user.service';
import { AppService } from '../services/app.service';

import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { UserRole } from '../models/user.model';

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

  constructor(
    private readonly attendance: AttendanceService,
    private readonly user: UserService,
    private readonly auth: UserService,
    private readonly app: AppService
  ) {

  }

  ngOnInit() {

  }

  ionViewDidEnter(): void {
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
          class: user.class
        }).then(res => console.log(res));
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
          class: user.class
        }).then();
      }
    }

  };

  checkForLocation() {
    this.auth.getUpdateDetails().subscribe((res: any) => {
      if (res.length > 0) {
        this.locationDistance = res[0].distanceCordinate;
        console.log('locaiton finding ');
        Geolocation.checkPermissions().then(permission => {
          if (permission.location === 'granted') {
            Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(loc => {
              this.getDistanceFromLatLonInKm(loc.coords.latitude, loc.coords.longitude, res[0].collegeLat, res[0].collegeLong);
            });
          } else {
            if (Capacitor.isNativePlatform()) {
              Geolocation.requestPermissions({ permissions: ['location'] }).then(reqPermission => {
                if (reqPermission.location === 'denied') {
                  this.app.showAlert('Please allow location to continue').then();
                }
              });
            } else {
              navigator.geolocation.getCurrentPosition(data => {
                this.getDistanceFromLatLonInKm(data.coords.latitude, data.coords.longitude, res[0].collegeLat, res[0].collegeLong);
              });
            }
          }
        });


      }
    });
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
      this.app.showAlert('Please allow location and restart the app to log attendance.').then();
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

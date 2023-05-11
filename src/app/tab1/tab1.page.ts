import { Component } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { AttendanceModel } from '../models/attendance.model';
import * as moment from 'moment';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';

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
export class Tab1Page {
  todayAttendance: AttendanceModel;
  hourDetails: HourDetail[] = [];
  currentTime = TimeEnum.none;
  timeEnum = TimeEnum;
  loggedBoth = false;

  constructor(
    private readonly attendance: AttendanceService,
    private readonly http: HttpClient,
    private readonly user: UserService
  ) {
    this.attendance.getTodayAttendance().subscribe((res: any) => {
      if (res && res.length > 0) {
        const data = res.map((item: any) => ({
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        }));
        this.todayAttendance = data[0];
        this.loggedBoth = this.todayAttendance.morning.length > 0 && this.todayAttendance.evening.length > 0;
      }
    });
    this.attendance.getHourDetails().subscribe((res: any) => {
      if (res && res.length > 0) {
        this.hourDetails = res;
        this.currentTime = this.getTime();
      }
    });
  }

  ionViewDidEnter(): void {

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
      const user = this.user.getCurrentUser();
      if (!this.todayAttendance) {
        this.attendance.addUserAttendanceData({
          aid: Date.now().toString(),
          userId: user.uid,
          dateStamp: moment().format('YYYY-MM-DD'),
          morning:  this.currentTime === TimeEnum.morning ? moment().format('hh:mm a') : '',
          evening: this.currentTime === TimeEnum.evening ? moment().format('hh:mm a') : ''
        }).then(res => console.log(res));
      } else {
        this.attendance.updateUserAttendanceData({
          aid: Date.now().toString(),
          id: this.todayAttendance.id,
          userId: user.uid,
          dateStamp: moment().format('YYYY-MM-DD'),
          morning:  this.todayAttendance.morning.length > 0 ? this.todayAttendance.morning :
          (this.currentTime === TimeEnum.morning ? moment().format('hh:mm a') : ''),
          evening: this.todayAttendance.evening.length > 0 ? this.todayAttendance.evening :
          (this.currentTime === TimeEnum.evening ? moment().format('hh:mm a') : '')
        }).then();
      }
    }
  }


}
enum TimeEnum {
  none,
  morning,
  evening
}

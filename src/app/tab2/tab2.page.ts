import { Component } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { AttendanceModel } from '../models/attendance.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  attendances: AttendanceModel[] = [];

  constructor(
    private readonly attendance: AttendanceService
  ) {
    this.attendance.getCurrentUserAttendances().subscribe((res: any) => {
      console.log(res);
      if(res && res.length > 0) {
        this.attendances = res;
      }
    });
  }
  getIcon = (attendance: AttendanceModel) => {
    let returnData = {name: 'checkmark-outline', color: 'orange'};
    if(attendance.morning.length > 0 && attendance.evening.length > 0) {
      returnData = {name: 'checkmark-done-outline', color: 'green'};
    } else if(attendance.morning.length === 0 && attendance.evening.length === 0) {
      returnData = {name: 'close-outline', color: 'red'};
    }
    return returnData;
  }
}

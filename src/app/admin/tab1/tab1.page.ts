import { Component } from '@angular/core';
import * as moment from 'moment';
import { AttendanceModel } from 'src/app/models/attendance.model';
import { AppService } from 'src/app/services/app.service';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-admin-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class AdminTab1Page {

  attendances: AttendanceModel[] = [];
  date: string;
  selectedClass = 0;
  selectedYear = 0;

  constructor(
    private readonly attendance: AttendanceService,
    private readonly app: AppService
  ) {

  }
  getIcon = (attendance: AttendanceModel) => {
    let returnData = { name: 'checkmark-outline', color: 'orange' };
    if (attendance.morning.length > 0 && attendance.evening.length > 0) {
      returnData = { name: 'checkmark-done-outline', color: 'green' };
    } else if (attendance.morning.length === 0 && attendance.evening.length === 0) {
      returnData = { name: 'close-outline', color: 'red' };
    }
    return returnData;
  };

  findAttendance(all = false) {
      if (this.selectedClass > 0 || all) {
        if (this.selectedYear > 0 || all) {
          this.attendance.getStudentAttendancesPerDate( moment().format('YYYY-MM-DD'),
            all ? '' : this.selectedClass.toString(),all ? '' : this.selectedYear.toString()).subscribe((res: any) => {
            if (res) {
              this.attendances = res;
            }
          });
        } else {
          this.app.showAlert('Please select year').then();
        }
      } else {
        this.app.showAlert('Please select class').then();
      }

  }

}

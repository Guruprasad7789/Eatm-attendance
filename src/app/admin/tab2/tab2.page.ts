import { Component } from '@angular/core';
import { AttendanceModel } from 'src/app/models/attendance.model';
import { AppService } from 'src/app/services/app.service';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-admin-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class AdminTab2Page {

  attendances: AttendanceModel[] = [];
  date: string;
  selectedClass = 0;
  selectedYear = 0;
  selectedDate = '';
  fullAttend = 0;
  eveningAttend = 0;
  morningAttend = 0;
  regdNo = '';

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
    if (this.selectedDate.length > 0) {
      if (this.selectedClass > 0 || all) {
        if (this.selectedYear > 0 || all) {
          this.attendance.getStudentAttendancesPerDate(this.selectedDate,
            all ? '' : this.selectedClass.toString(),all ? '' : this.selectedYear.toString()).subscribe((res: AttendanceModel[]) => {
            if (res) {
              this.attendances = this.regdNo.length > 0 && this.regdNo.trim().length > 0 ?
               res.filter(e => e.studentId === this.regdNo) : res;
              this.fullAttend = this.attendances .filter(e => e.morning.length > 0 && e.evening.length > 0).length;
              this.morningAttend = this.attendances .filter(e => e.morning.length > 0 && e.evening.length === 0).length;
              this.eveningAttend = this.attendances .filter(e => e.morning.length === 0 && e.evening.length > 0).length;
            }
          });
        } else {
          this.app.showAlert('Please select year').then();
        }
      } else {
        this.app.showAlert('Please select class').then();
      }
    } else {
      this.app.showAlert('Please select date').then();
    }
  }

}

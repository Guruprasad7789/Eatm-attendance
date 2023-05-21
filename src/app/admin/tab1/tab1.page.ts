import { Component } from '@angular/core';
import * as moment from 'moment';
import { AttendanceModel } from 'src/app/models/attendance.model';
import { ClassRole } from 'src/app/models/user.model';
import { AppService } from 'src/app/services/app.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class AdminTab1Page {

  readonly excelType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  readonly excelExtension = '.xlsx';
  attendances: AttendanceModel[] = [];
  date: string;
  selectedClass = 0;
  selectedYear = 0;
  fullAttend = 0;
  morningAttend = 0;
  eveningAttend = 0;
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
    if (this.selectedClass > 0 || all) {
      if (this.selectedYear > 0 || all) {
        this.attendance.getStudentAttendancesPerDate(moment().format('YYYY-MM-DD'),
          all ? '' : this.selectedClass.toString(), all ? '' : this.selectedYear.toString()).subscribe((res: AttendanceModel[]) => {
            if (res) {
              console.log(res);
              this.attendances = this.regdNo.length > 0 && this.regdNo.trim().length > 0 ?
                res.filter(e => e.studentId === this.regdNo) : res;
              this.fullAttend = this.attendances.filter(e => e.morning.length > 0 && e.evening.length > 0).length;
              this.morningAttend = this.attendances.filter(e => e.morning.length > 0 && e.evening.length === 0).length;
              this.eveningAttend = this.attendances.filter(e => e.morning.length === 0 && e.evening.length > 0).length;
            }
          });
      } else {
        this.app.showAlert('Please select year').then();
      }
    } else {
      this.app.showAlert('Please select class').then();
    }

  }
  downloadInExcel() {
    if (this.attendances.length > 0) {
      const data = this.attendances.map(item => {
        const tempData = JSON.parse(JSON.stringify(item));
        delete tempData.class;
        return {
          ...item,
          class: ClassRole[item.class],
        };
      });
      this.app.changeLoader(true);
      const name = 'excel-to-json' + Date.now();
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, name);
      XLSX.writeFile(workbook, name + this.excelExtension);
    } else {
      this.app.showAlert('Please search to download.').then();
    }
  }
}

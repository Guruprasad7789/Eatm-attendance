import { Component } from '@angular/core';
import * as moment from 'moment';
import { AttendanceModel } from 'src/app/models/attendance.model';
import { ClassRole } from 'src/app/models/user.model';
import { AppService } from 'src/app/services/app.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import * as XLSX from 'xlsx';
import {File} from '@ionic-native/file/ngx';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-admin-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
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
  roomNo = null;
  constructor(
    private readonly attendance: AttendanceService,
    private readonly app: AppService,
    private readonly file: File
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
              if(this.roomNo && this.roomNo > 0) {
                this.attendances = this.attendances.filter(item => item.roomNo === this.roomNo.toString());
              }
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
    this.writeToClipboard().then(() => {
      alert('Attendaces JSON are copied to your clipboard.'+
      ' Use "https://codebeautify.org/json-to-excel-converter" to generate excel.');
      window.open('https://codebeautify.org/json-to-excel-converter', '_system')
    });
  }

writeToClipboard = async () => {
  await Clipboard.write({
    string: JSON.stringify(this.attendances)
  });
};
  // downloadInExcel() {
  //   if (this.attendances.length > 0) {
  //     const data = this.attendances.map(item => {
  //       const tempData = JSON.parse(JSON.stringify(item));
  //       delete tempData.class;
  //       return {
  //         ...item,
  //         class: ClassRole[item.class],
  //       };
  //     });
  //     this.app.changeLoader(true);
  //     const worksheet = XLSX.utils.json_to_sheet(data);
  //     const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  //     const buffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
  //     this.saveFile(buffer);
  //   } else {
  //     this.app.showAlert('Please search to download.').then();
  //   }
  // }
  // saveFile(buffer: any) {
  //   const name = 'attendance' + Date.now();
  //   const blob = new Blob([buffer], {type: this.excelType});
  //   this.file.writeFile(this.file.externalRootDirectory, name + this.excelExtension, blob, {replace: true}).then(res => {
  //     this.app.changeLoader(false);
  //     this.app.showAlert('File saved to phone').then();
  //   }).catch(err => {
  //     this.app.changeLoader(false);
  //     this.app.showAlert('Failed to saved to phone').then();
  //   });
  // }
}

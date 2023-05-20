import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { AppService } from './services/app.service';
import { Platform } from '@ionic/angular';


import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { AttendanceModel } from './models/attendance.model';
import { UserRole } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  updateAvailable = false;
  todayAttendance: AttendanceModel;
  loggedBoth = false;
  locationDistance = 0;


  constructor(
    public readonly auth: UserService,
    public readonly app: AppService,
    public readonly platform: Platform,

  ) {


    this.auth.getUpdateDetails().subscribe((res: any) => {
      if (res.length > 0) {
        localStorage.setItem('updateData', JSON.stringify(res[0]));
        if (res.length > 0 && res[0].isMassUpdate) {
          this.updateAvailable = true;
          this.app.showAlert('Update available. Please update the app from store.').then();
        }
      }
    });

  }

  ngOnInit(): void {
    this.platform.ready().then(() => {
      this.checkForLocation();
    });
  }

  checkForLocation() {
    this.app.changeLoader(true);
    Geolocation.checkPermissions().then(permission => {
      if (permission.location === 'granted') {
        Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(loc => {
          this.saveLocations(loc.coords);
        });
      } else {
        if (Capacitor.isNativePlatform()) {
          Geolocation.requestPermissions({ permissions: ['location'] }).then(reqPermission => {
            if (reqPermission.location === 'denied') {
              this.app.showAlert('Please allow location to continue').then();
            } else if (reqPermission.location === 'granted') {
              Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(loc => {
                this.saveLocations(loc.coords);
              });
            }
            else {
              this.app.showAlert('Please allow location to continue').then();
            }
          });
        } else {
          navigator.geolocation.getCurrentPosition(data => {
            this.saveLocations(data.coords);
          });
        }
      }
    }).catch(err => {
      this.app.showAlert('Please turn on location, clear from background and restart the app.').then();
    });



  }

  // locations distance measuring
  saveLocations(cooard: GeolocationCoordinates) {
    if (cooard && cooard.latitude && cooard.longitude) {
      localStorage.setItem('locations', JSON.stringify(cooard));
    } else {
      this.app.showAlert('Please allow location to continue').then();
    }
  }



  signOut() {
    this.auth.signOut();
  };



}



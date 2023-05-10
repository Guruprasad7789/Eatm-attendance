import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { AppService } from './services/app.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  updateAvailable = false;
  constructor(
    public readonly auth: UserService,
    public readonly app: AppService,
  ) {
    this.auth.getUpdateDetails().subscribe((res: any) => {
      if(res.length > 0 && res.isMassUpdate) {
        this.updateAvailable = true;
        this.app.showAlert('Update available. Please update.').then();
      }
    });

  }
   signOut() {
    this.auth.signOut();
  }

}

import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public readonly auth: UserService,
  ) {

  }
   signOut() {
    this.auth.signOut();
  }

}

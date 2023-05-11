import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserRole } from '../models/user.model';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  readonly userRole = UserRole;
  constructor(public user: UserService) {}

}

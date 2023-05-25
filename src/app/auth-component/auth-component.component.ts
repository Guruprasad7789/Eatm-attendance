import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { UserModel, UserRole } from '../models/user.model';
import { AppService } from '../services/app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth-component.component.html',
  styleUrls: ['./auth-component.component.scss'],
})
export class AuthComponentComponent implements OnDestroy {
  screen: any = 'signin';
  formData: FormGroup;
  isLoading = false;
  subscription = new Subscription();
  constructor(private fb: FormBuilder, private auth: UserService, private readonly router: Router,
    private readonly app: AppService) {
    this.formData = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      studentId: ['', [Validators.required]],
      class: ['', [Validators.required]],
      year: ['', [Validators.required]],
      roomNo: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }


  change(event) {
    this.screen = event;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  login() {
    this.isLoading = true;
    const email = this.formData.get('email').value;
    const password = this.formData.get('password').value;
    console.log(this.formData.value);
    this.auth.signIn(email, password).then(async (data: any) => {
      const deviceId = await (await this.auth.getDeviceId()).identifier;
      this.subscription = data.subscribe(res => {
        if (res) {
          if (!!res.deviceId && deviceId === res.deviceId || res.role === UserRole.admin) {
            localStorage.setItem('UserInfo', JSON.stringify(res));
            this.router.navigate(['home/tabs/' + (res.role === UserRole.admin ? 'admin/' : '') + 'tab1']).then();
          } else {
            alert('You can only login in the device you signed up.');
            this.auth.signOut();
            window.location.reload();
          }
        }
      });

    });
  }

  async register() {
    if (this.formData.valid) {
      this.isLoading = true;
      const payload = this.formData.value as UserModel;
      payload.role = UserRole.user;
      payload.deviceId = await (await this.auth.getDeviceId()).identifier;
      this.auth.signUp(payload).then((data: any) => {
        this.screen = 'signin';
      });
    }
  }

}

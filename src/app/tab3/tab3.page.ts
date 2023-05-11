import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { FirebaseUser } from '../models/user.model';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  ionicForm: FormGroup;
  isSubmitted = false;
  dob = '1998-01-01';
  fUser: FirebaseUser;
  constructor(public formBuilder: FormBuilder,
    private readonly auth: UserService) {
      this.ionicForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
        dob: ['', [Validators.required]],
        class: ['', [Validators.required]],
        year: ['', [Validators.required]],
        studentId: ['', [Validators.required]]
      });
  }
  ionViewDidEnter(): void {
    this.fUser = this.auth.getCurrentUser();
    const res = this.auth.getUser();
    console.log(res);
    if (!!res) {
      this.ionicForm.patchValue({
        email: res.email, name: res.name,
        studentId: res.studentId, dob: (res.dob.length > 10 ? res.dob.substring(0, 10) : res.dob), class: res.class, year: res.year
      });
      this.dob = (res.dob.length > 10 ? res.dob.substring(0, 10) : res.dob);
    }
  }
  getDate(e) {
    const date = new Date(e.target.value).toISOString().substring(0, 10);
    this.ionicForm.get('dob').setValue(date, {
      onlyself: true
    });
  }
  get errorControl() {
    return this.ionicForm.controls;
  }
  submitForm() {
    this.isSubmitted = true;
    this.ionicForm.controls.dob.patchValue(this.dob);
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
      console.log(this.ionicForm.value);
      const user = {
        ...this.ionicForm.value,
        uid: this.fUser.uid
      }
      this.auth.updateUser(user).then();
    }
  }
}

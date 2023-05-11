import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { UserModel, UserRole } from '../models/user.model';

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth-component.component.html',
  styleUrls: ['./auth-component.component.scss'],
})
export class AuthComponentComponent  {
  screen: any = 'signin';
  formData: FormGroup;
  isLoading = false;
  constructor(private fb: FormBuilder, private auth: UserService, private readonly router: Router) {
    this.formData = this.fb.group({
      name: ['',[Validators.required]],
      email: ['',[Validators.required]],
      dob: ['',[Validators.required]],
      studentId: ['',[Validators.required]],
      class: ['',[Validators.required]],
      year: ['',[Validators.required]],
      password: ['',[Validators.required]],
    });
  }


  change(event){
    this.screen = event;
  }

  login(){
      this.isLoading = true;
      const email = this.formData.get('email').value;
      const password = this.formData.get('password').value;
      console.log(this.formData.value);
      this.auth.signIn(email, password).then((data: any)=>{
      });
  }

  register(){
    if(this.formData.valid){
      this.isLoading = true;
      const payload = this.formData.value as UserModel;
      payload.role = UserRole.user;
      this.auth.signUp(payload).then((data: any)=>{
        this.screen = 'signin';
      });
    }
  }

}

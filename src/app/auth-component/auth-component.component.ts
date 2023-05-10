import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth-component.component.html',
  styleUrls: ['./auth-component.component.scss'],
})
export class AuthComponentComponent implements OnInit {
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

  ngOnInit() {
    if(this.auth.isLoggedIn()) {
      this.router.navigate(['home/tabs/tab1']).then();
    }
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
    const formData: any = new FormData();
    if(this.formData.valid){
      this.isLoading = true;
      formData.append('name', this.formData.get('name').value);
      formData.append('email', this.formData.get('email').value);
      formData.append('dob', new Date().toISOString());
      formData.append('studentId', this.formData.get('studentId').value);
      formData.append('password', this.formData.get('password').value);
      this.auth.signUp(this.formData.value).then((data: any)=>{
        this.screen = 'signin';
      });
    }
  }

}

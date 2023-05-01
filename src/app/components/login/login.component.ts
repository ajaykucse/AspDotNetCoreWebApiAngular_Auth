import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router : Router, private toast: NgToastService){}
  ngOnInit(): void{
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }
  onLogin(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value);
      // send the obj to database
      this.auth.login(this.loginForm.value)
      .subscribe({
       next:(res)=>{
        this.loginForm.reset();
        this.auth.storeToken(res.token);
        this.toast.success({detail:"SUCCESS", summary:res.message, duration:3000});
        this.router.navigate(['dashboard'])
       },
       error:(err)=>{
        this.toast.error({detail:"ERROR", summary:"Something went wrong", duration:3000});
       }
      })
    }else{
      // throw the error using toaster ans with required fields
      this.validateAllFormFields(this.loginForm);
      this.toast.error({detail:"ERROR", summary:"Your form is invalid", duration:3000});
    }
  }
  private validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf: true});
      }else if(control instanceof FormGroup){
        this.validateAllFormFields(control)
      }
    })
  }
}

import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signupForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth : AuthService, private router : Router, private toast: NgToastService){}
  ngOnInit(): void{
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }
  onSingup(){
    if(this.signupForm.valid){
      console.log(this.signupForm.value);
      // send the obj to database
      this.auth.signUp(this.signupForm.value)
      .subscribe({
       next:(res)=>{        
        this.toast.success({detail:"SUCCESS", summary:res.message, duration:3000});
        this.signupForm.reset();
        this.router.navigate(['login']);
       },
       error:(err)=>{
        this.toast.error({detail:"ERROR", summary:"Something went wrong", duration:3000});
       }
      })
    }else{
      // throw the error using toaster ans with required fields
      this.validateAllFormFields(this.signupForm);
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

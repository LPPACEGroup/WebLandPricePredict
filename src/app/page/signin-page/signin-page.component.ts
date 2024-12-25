import { Component } from '@angular/core';
import { AuthService } from '../../service/Auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface SignInData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-signin-page',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './signin-page.component.html',
  styleUrl: './signin-page.component.css',
})
export class SigninPageComponent {
  errorMessage: string = '';
  siginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.siginForm = this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]]
    })
  }
  onSignin() {
    if(this.siginForm.valid)
    {
      
      const fromValue:SignInData = this.siginForm.value;

      this.authService
      .signin(fromValue.email, fromValue.password)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.authService.updateSignInStatus(true);
          this.router.navigate(['/Home']);
        },
        error: (error: any) => {
          this.errorMessage = error.error.message||'sonething went wrong, Please try again';
        },
      });
    }
    else{
      this.errorMessage = 'Please enter valid email and password';
    }
  }
}

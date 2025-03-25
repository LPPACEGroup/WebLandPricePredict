import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'app/service/Auth/auth.service';

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [MatIcon,RouterLink,ReactiveFormsModule],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.css'
})
export class ForgetpasswordComponent {
  resetPassword!: FormGroup;

  constructor(private authService: AuthService) {
    this.resetPassword = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  onSubmit() {
    if (this.resetPassword.valid) {
      const modal = document.getElementById(
        'forget_password'
      ) as HTMLDialogElement;
      modal.showModal();
      console.log('Reset Password:', this.resetPassword.value);
      const email = this.resetPassword.value.email;
      console.log('Email:', email);
      
      this.authService.forgetPassword(email).subscribe({
        next: (response: any) => {
          console.log('Reset Password Response : ', response);
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
      });
    }
  }

}

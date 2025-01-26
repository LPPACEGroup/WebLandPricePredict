import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'app/service/Auth/auth.service';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, Router,ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [MatIcon,RouterLink,ReactiveFormsModule,CommonModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent {
resetPassword!: FormGroup;
token: string | null = null;

  constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute) {
    this.resetPassword = new FormGroup({
      newpassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  ngOnInit(): void {
    // Extract the token from the query parameters
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    });
  }

  onSubmit() {
    if (this.resetPassword.valid) {
      console.log('Reset Password:', this.resetPassword.value);
      const newpassword = this.resetPassword.value.newpassword;
      
      this.authService.resetPassword(this.token||'',newpassword).subscribe({
        next: (response: any) => {
          console.log('Reset Password Response : ', response);
          this.router.navigate(['/signin']);
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
      });
    }
  }
}

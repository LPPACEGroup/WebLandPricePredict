import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'app/service/Auth/auth.service';
import { catchError, map, Observable } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  profileForm!: FormGroup;
  userData: any;
  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.profileForm = this.fb.group(
          {
            username: ['', [Validators.required]], // Example: username with min length
            password: ['', [Validators.required, Validators.minLength(8)]], // Example: password validation
            confirmPassword: ['', [Validators.required, Validators.minLength(8)]], // Example: password
            email: ['', [Validators.required, Validators.email],[this.emailExistsValidator.bind(this)]], // Email validation
            firstName: ['', [
              Validators.required,
              Validators.pattern(/^[A-Za-zÀ-ÿ]+$/),  // Allows alphabetic characters and accented characters only
            ]], // First name required
            lastName: ['', [
              Validators.required,
              Validators.pattern(/^[A-Za-zÀ-ÿ]+$/),  // Allows alphabetic characters and accented characters only
            ]], // Last name required
            gender: ['', Validators.required], // Gender required
            birthDate: ['', Validators.required], // Birth date required
            telephone: ['', [Validators.required, Validators.pattern(/^0?\d{9}$/)]], // Phone number pattern
            tier: ['Basic', Validators.required], // Tier required
            notification: [true], // Default to true
            notiNews: [false], // Default to false
            role: ['User', Validators.required], // Role required
            province: ['', Validators.required],
            district: ['', Validators.required],
            sub_district: ['', Validators.required],
            postcode: ['', Validators.required],
            home_number: [
              '',
              [Validators.required, Validators.pattern(/^\d+(\/*\d+)?$/)],
            ],
            alley: ['', Validators.required],
            interestLand: [1],
          },
        );
  }
  ngOnInit(): void {
    // Initialization logic here
    this.authService.getUserData().subscribe({
      next: (response: any) => {
        this.userData = response;
        console.log(response);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
  emailExistsValidator(control: any): Observable<any> {
      return this.authService.checkuserexist(control.value).pipe(
        map(response => (response.exists ? { emailExists: true } : null)),
        catchError(async () => null) // If there's an error (like server down), treat it as no existing email.
      );
    }
}

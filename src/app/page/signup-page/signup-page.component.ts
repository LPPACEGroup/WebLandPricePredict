import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from 'app/service/Auth/auth.service';
import { User } from 'model/user.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterselectComponent } from 'app/core/filterselect/filterselect.component';
import { ThaiLocationService } from 'app/service/ThaiLocation/thai-location.service';
import { ChangeDetectorRef } from '@angular/core';
import { distinct } from 'rxjs';
import { PasswordMatchValidator } from './confirm-password';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    FilterselectComponent,
  ],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css',
})
export class SignupPageComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  currentStep: number = 1;
  Province: string[] = [];
  District: string[] = [];
  Sub_district: string[] = [];
  Postcode: number[] = [];
  private thaiLocationService?: ThaiLocationService;

  @HostListener('wheel', ['$event'])
  onWheel(event: Event) {
    event.preventDefault();
  }

  constructor(
    private fb: FormBuilder,
    thaiLocationService: ThaiLocationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.thaiLocationService = thaiLocationService;
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, ]], // Example: username with min length
      password: ['', [Validators.required, Validators.minLength(8)]], // Example: password validation
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]], // Example: password
      email: ['', [Validators.required, Validators.email]], // Email validation
      firstName: ['', Validators.required], // First name required
      lastName: ['', Validators.required], // Last name required
      gender: ['', Validators.required], // Gender required
      birthDate: ['', Validators.required], // Birth date required
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]], // Phone number pattern
      tier: ['Basic', Validators.required], // Tier required
      notification: [true], // Default to true
      notiNews: [false], // Default to false
      role: ['User', Validators.required], // Role required
      province: ['', Validators.required],
      district: ['', Validators.required],
      sub_district: ['', Validators.required],
      postcode: [0, Validators.required],
      home_number: ['', [Validators.required, Validators.pattern(/^\d+\/\d+$/)]],
      alley: ['', Validators.required],
    },{
      validators: PasswordMatchValidator('password', 'confirmPassword')
    });
  }

  nextStep() {
    if (this.currentStep < 4) {
      let isValid = true;

      if (this.currentStep ==1 ){
        const fieldsToValidate = ['username', 'email', 'password', 'confirmPassword'];
        // fieldsToValidate.forEach((field) => {
        //   const control = this.signupForm.get(field);
        //   control?.markAsTouched(); // Mark the field as touched
        //   if (control?.invalid) {
        //     isValid = false;
        //   }
        // });
      }
      else if (this.currentStep == 2){
        // const fieldsToValidate = ['firstName', 'lastName','gender','birthDate','telephone'];
        // fieldsToValidate.forEach((field) => {
        //   const control = this.signupForm.get(field);
        //   control?.markAsTouched(); // Mark the field as touched
        //   if (control?.invalid) {
        //     console.log(control.invalid);
            
        //     isValid = false;
        //   }
        // });
      }
      else if (this.currentStep == 3){
        const fieldsToValidate = ['province', 'district','sub_district','postcode','home_number','alley'];
        fieldsToValidate.forEach((field) => {
          const control = this.signupForm.get(field);
          control?.markAsTouched(); // Mark the field as touched
          if (control?.invalid) {
            console.log(control.invalid);
            
            isValid = false;
          }
        });
      }

      

  
      if (!isValid) {
        alert('Please fill all required fields and ensure all inputs are valid.');
        return; // Stop if any visible field is invalid
      }
  
      // Proceed to the next step if all visible fields are valid
      this.currentStep++;
    
  }
}

  perviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  printForm() {
    this.signupForm.patchValue({
      postcode:parseInt(this.signupForm.value.postcode, 10)
    })
    console.log('Form Value : ', this.signupForm.value);
  }

  ngOnInit() {
    this.thaiLocationService?.getProvince().then((data) => {
      this.Province = data;
      this.cdr.detectChanges();
    });
    this.thaiLocationService?.getAmphoe().then((data) => {
      this.District = data;
      this.cdr.detectChanges();
    });
    this.thaiLocationService?.getdistrict().then((data) => {
      this.Sub_district = data;
      this.cdr.detectChanges();
    });
    this.thaiLocationService?.getPostcode().then((data) => {
      this.Postcode = data;
      this.cdr.detectChanges();
    });
  }
  get provinceControl(): FormControl {
    return this.signupForm.get('province') as FormControl;
  }
  get districtControl(): FormControl {
    return this.signupForm.get('district') as FormControl;
  }
  get sub_districtControl(): FormControl {
    return this.signupForm.get('sub_district') as FormControl;
  }
  get postcodeControl(): FormControl {
    return this.signupForm.get('postcode') as FormControl;
  }
}

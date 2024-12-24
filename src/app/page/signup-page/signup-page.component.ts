import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'app/service/Auth/auth.service';
import { User } from 'model/user.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterselectComponent } from 'app/core/filterselect/filterselect.component';
import { ThaiLocationService } from 'app/service/ThaiLocation/thai-location.service';
import { ChangeDetectorRef } from '@angular/core';
import { PasswordMatchValidator } from './confirm-password';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    FilterselectComponent,
    MatCardModule,
    MatCheckboxModule,
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
  isUpdatingForm: boolean = false;
  previousValue: any = { sub_district: '', postcode: 0, district: '' };
  private thaiLocationService?: ThaiLocationService;

  items = [
    {
      name: 'Item 1',
      description: 'Description of Item 1',
      image: 'path_to_image_1',
      selected: false,
    },
    {
      name: 'Item 2',
      description: 'Description of Item 2',
      image: 'path_to_image_2',
      selected: false,
    },
    {
      name: 'Item 3',
      description: 'Description of Item 3',
      image: 'path_to_image_3',
      selected: false,
    },
    {
      name: 'Item 1',
      description: 'Description of Item 1',
      image: 'path_to_image_1',
      selected: false,
    },
    {
      name: 'Item 2',
      description: 'Description of Item 2',
      image: 'path_to_image_2',
      selected: false,
    },
    {
      name: 'Item 3',
      description: 'Description of Item 3',
      image: 'path_to_image_3',
      selected: false,
    },
    {
      name: 'Item 2',
      description: 'Description of Item 2',
      image: 'path_to_image_2',
      selected: false,
    },
    {
      name: 'Item 3',
      description: 'Description of Item 3',
      image: 'path_to_image_3',
      selected: false,
    },
  ];
  @HostListener('wheel', ['$event'])
  onWheel(event: Event) {
    event.preventDefault();
  }

  constructor(
    private fb: FormBuilder,
    thaiLocationService: ThaiLocationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.thaiLocationService = thaiLocationService;
    this.signupForm = this.fb.group(
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
      {
        validators: PasswordMatchValidator('password', 'confirmPassword'),
      }
    );
  }

  nextStep() {
    if (this.currentStep < 4) {
      let isValid = true;

      if (this.currentStep == 1) {
        const fieldsToValidate = [
          'username',
          'email',
          'password',
          'confirmPassword',
        ];
        fieldsToValidate.forEach((field) => {
          const control = this.signupForm.get(field);
          control?.markAsTouched(); // Mark the field as touched
          if (control?.invalid) {
            isValid = false;
          }
        });
      } else if (this.currentStep == 2) {
        const fieldsToValidate = [
          'firstName',
          'lastName',
          'gender',
          'birthDate',
          'telephone',
        ];
        fieldsToValidate.forEach((field) => {
          const control = this.signupForm.get(field);
          control?.markAsTouched(); // Mark the field as touched
          if (control?.invalid) {
            console.log(control.invalid);
            console.log(this.signupForm.get('telephone')?.errors);  
          
            isValid = false;
          }
        });
      } else if (this.currentStep == 3) {
        const fieldsToValidate = [
          'province',
          'district',
          'sub_district',
          'postcode',
          'home_number',
          'alley',
        ];
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
        alert(
          'Please fill all required fields and ensure all inputs are valid.'
        );
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
      postcode: this.signupForm.value.postcode.toString(),
    });
    const newuser: User = {
      username: this.signupForm.value.username,
      password: this.signupForm.value.password,
      email: this.signupForm.value.email,
      first_name: this.signupForm.value.firstName,
      last_name: this.signupForm.value.lastName,
      gender: this.signupForm.value.gender,
      birth_date: this.signupForm.value.birthDate,
      telephone: this.signupForm.value.telephone,
      tier: this.signupForm.value.tier,
      notification: this.signupForm.value.notification,
      noti_news: this.signupForm.value.notiNews,
      role: this.signupForm.value.role,
      province: this.signupForm.value.province,
      district: this.signupForm.value.district,
      sub_district: this.signupForm.value.sub_district,
      post_code: this.signupForm.value.postcode,
      home_number: this.signupForm.value.home_number,
      alley: this.signupForm.value.alley,
      area_interest: this.signupForm.value.interestLand,
    };
    console.log(newuser);
    
    this.authService.signup(newuser).subscribe({
      next: () => {
        alert('User created successfully');
        this.router.navigate(['/Signin']);
      },
      error: (error) => {
        this.errorMessage = error.error.message;
      },
    });
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

    this.signupForm.valueChanges.subscribe((value) => {
      if (this.isUpdatingForm) {
        this.previousValue.sub_district =
          this.signupForm.get('sub_district')?.value;
        this.previousValue.postcode = this.signupForm.get('postcode')?.value;
        this.previousValue.district = this.signupForm.get('district')?.value;
        return; // Skip if currently updating the form
      }
      const selected_postcode = parseInt(value.postcode, 10) | value.postcode;
      const selected_sub_district = value.sub_district;
      const selected_district = value.district;

      // console.log(selected_sub_district,this.previousValue.sub_district ,"dddd");
      // console.log(selected_postcode,this.previousValue.postcode , "pppp");

      if (selected_sub_district !== this.previousValue.sub_district) {
        this.thaiLocationService
          ?.getDetailbyDistrict(selected_sub_district)
          .then((data) => {
            console.log('sub_district');

            if (data && data.length > 0) {
              this.isUpdatingForm = true;
              this.signupForm.patchValue(
                {
                  province: data[0].province,
                  district: data[0].amphoe,
                  postcode: data[0].zipcode,
                },
                { emitEvent: false }
              );
            }
            this.previousValue.sub_district =
              this.signupForm.get('sub_district')?.value;
            this.previousValue.postcode =
              this.signupForm.get('postcode')?.value;
            this.previousValue.district =
              this.signupForm.get('district')?.value;
            this.isUpdatingForm = false;
          });
      } else if (
        selected_postcode &&
        selected_postcode !== this.previousValue.postcode
      ) {
        this.thaiLocationService
          ?.getDetailsByPostcode(selected_postcode)
          .then((data) => {
            console.log('postcode');

            if (data && data.length > 0) {
              let sub_district = data.map((item) => item.district);

              this.Sub_district = sub_district;
              this.isUpdatingForm = true;
              this.signupForm.patchValue(
                {
                  province: data[0].province,
                  district: data[0].amphoe,
                  sub_district: '',
                },
                { emitEvent: false }
              );
            }
            this.previousValue.sub_district =
              this.signupForm.get('sub_district')?.value;
            this.previousValue.postcode =
              this.signupForm.get('postcode')?.value;
            this.previousValue.district =
              this.signupForm.get('district')?.value;
            this.isUpdatingForm = false;
          });
      } else if (selected_district !== this.previousValue.district) {
        this.thaiLocationService
          ?.getDetailbyAmphoe(selected_district)
          .then((data) => {
            console.log('district');

            if (data && data.length > 0) {
              console.log(data);

              this.isUpdatingForm = true;
              this.signupForm.patchValue(
                {
                  province: data[0].province,
                  postcode: '',
                  sub_district: '',
                },
                { emitEvent: false }
              );
            }
            this.previousValue.sub_district =
              this.signupForm.get('sub_district')?.value;
            this.previousValue.postcode =
              this.signupForm.get('postcode')?.value;
            this.previousValue.district =
              this.signupForm.get('district')?.value;
            this.isUpdatingForm = false;
          });
      }
    });
  }
  emailExistsValidator(control: any): Observable<any> {
    return this.authService.checkuserexist(control.value).pipe(
      map(response => (response.exists ? { emailExists: true } : null)),
      catchError(async () => null) // If there's an error (like server down), treat it as no existing email.
    );
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

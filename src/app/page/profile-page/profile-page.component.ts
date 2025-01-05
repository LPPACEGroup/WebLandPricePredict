import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterselectComponent } from 'app/core/filterselect/filterselect.component';
import { AuthService } from 'app/service/Auth/auth.service';
import { catchError, map, Observable, of } from 'rxjs';
import { ThaiLocationService } from 'app/service/ThaiLocation/thai-location.service';
import { UserService } from 'app/service/User/user.service';
import { User } from 'model/user.interface';
import { Location } from '@angular/common';


interface UserProfile {
avatarUrl: any;
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  postalCode: string;
  interests: string[];
  tier: string;
  paymentDate: string;
}


@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [MatIconModule, CommonModule,ReactiveFormsModule,FilterselectComponent],

  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})

export class ProfilePageComponent implements OnInit {

  sEditing = false;
  profileForm: FormGroup;
  Province: string[] = [];
  District: string[] = [];
  Sub_district: string[] = [];
  Postcode: number[] = [];
  previousValue: any = { sub_district: '', postcode: 0, district: '' };
  isUpdatingForm: boolean = false;
  errorMessage: string = '';

  private thaiLocationService?: ThaiLocationService;

  

  constructor(private fb: FormBuilder,    private authService: AuthService,    thaiLocationService: ThaiLocationService,    private cdr: ChangeDetectorRef,private userService: UserService, private location: Location
  ) {
    
    this.thaiLocationService = thaiLocationService;
    this.profileForm = this.fb.group({
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
    });
    this.profileForm.disable();

  }

  async ngOnInit() {
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

    this.Province = (await this.thaiLocationService?.getProvince()) || [];
    this.District = (await this.thaiLocationService?.getAmphoe()) || [];
    this.Sub_district = (await this.thaiLocationService?.getdistrict()) || [];
    this.Postcode = (await this.thaiLocationService?.getPostcode()) || [];

    this.userService.getUserData().subscribe({
      next: (response: any) => {
        this.profileForm.enable();
        console.log(response);
        this.profileForm.patchValue({
          username: response.userName,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          telephone: response.telephone,
          province: response.province,
          district: response.district,
          sub_district: response.sub_district,
          postcode: response.postcode,
          home_number: response.home_number,
          alley: response.alley,
          birthDate: response.birthDate,
          gender : response.gender,
        })
        this.profileForm.disable();

      },
      error: (error: any) => {
        console.error(error);
      },
    });

    
    this.profileForm.valueChanges.subscribe((value) => {
      if (this.isUpdatingForm) {
        this.previousValue.sub_district =
          this.profileForm.get('sub_district')?.value;
        this.previousValue.postcode = this.profileForm.get('postcode')?.value;
        this.previousValue.district = this.profileForm.get('district')?.value;
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
              this.profileForm.patchValue(
                {
                  province: data[0].province,
                  district: data[0].amphoe,
                  postcode: data[0].zipcode,
                },
                { emitEvent: false }
              );
            }
            this.previousValue.sub_district =
              this.profileForm.get('sub_district')?.value;
            this.previousValue.postcode =
              this.profileForm.get('postcode')?.value;
            this.previousValue.district =
              this.profileForm.get('district')?.value;
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
              this.profileForm.patchValue(
                {
                  province: data[0].province,
                  district: data[0].amphoe,
                  sub_district: '',
                },
                { emitEvent: false }
              );
            }
            this.previousValue.sub_district =
              this.profileForm.get('sub_district')?.value;
            this.previousValue.postcode =
              this.profileForm.get('postcode')?.value;
            this.previousValue.district =
              this.profileForm.get('district')?.value;
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
              this.profileForm.patchValue(
                {
                  province: data[0].province,
                  postcode: '',
                  sub_district: '',
                },
                { emitEvent: false }
              );
            }
            this.previousValue.sub_district =
              this.profileForm.get('sub_district')?.value;
            this.previousValue.postcode =
              this.profileForm.get('postcode')?.value;
            this.previousValue.district =
              this.profileForm.get('district')?.value;
            this.isUpdatingForm = false;
          });
      }
    });
    
  }

  startEditing() {
    this.sEditing = true;
    this.resetForm();
    this.profileForm.enable();
    
  }

  cancelEdit() {
    this.sEditing = false;
    this.resetForm();
    this.profileForm.disable();

  }

  saveChanges() {
    this.profileForm.patchValue({
      postcode: this.profileForm.value.postcode.toString(),
    });
    if (true) {
      
      this.sEditing = false;

      console.log("saveChanges");
      
      const profileUpdate: User = {
        username: this.profileForm.value.username,
        password: this.profileForm.value.password,
        email: this.profileForm.value.email,
        first_name: this.profileForm.value.firstName,
        last_name: this.profileForm.value.lastName,
        gender: this.profileForm.value.gender,
        birth_date: this.profileForm.value.birthDate,
        telephone: this.profileForm.value.telephone,
        notification: this.profileForm.value.notification,
        noti_news: this.profileForm.value.notiNews,
        role: this.profileForm.value.role,
        province: this.profileForm.value.province,
        district: this.profileForm.value.district,
        sub_district: this.profileForm.value.sub_district,
        post_code: this.profileForm.value.postcode,
        home_number: this.profileForm.value.home_number,
        alley: this.profileForm.value.alley,
        area_interest: this.profileForm.value.interestLand,
      };

      this.userService.updateUser(profileUpdate).subscribe({
        next: () => {
          alert('Profile Update successfully');
          window.location.reload();
        },
        error: (error) => {
          this.errorMessage = error.error.message;
        },
      });

      this.profileForm.disable();

    }
    console.log(this.profileForm.errors);
    
  }


  private resetForm() {

  }
  emailExistsValidator(control: any): Observable<any> {
    
    return this.authService.checkuserexist(control.value).pipe(
      map(() => null), // No error if the email does not exist
      catchError((error) => {
        if (error.status === 409) {
          return of({ emailExists: true }); // Error if the email exists
        }
        console.error('Error in emailExistsValidator:', error); // Log unexpected errors
        return of(null); // Treat other errors as valid
      })
    );
  }
  

    get provinceControl(): FormControl {
      return this.profileForm.get('province') as FormControl;
    }
    get districtControl(): FormControl {
      return this.profileForm.get('district') as FormControl;
    }
    get sub_districtControl(): FormControl {
      return this.profileForm.get('sub_district') as FormControl;
    }
    get postcodeControl(): FormControl {
      return this.profileForm.get('postcode') as FormControl;
    }
}

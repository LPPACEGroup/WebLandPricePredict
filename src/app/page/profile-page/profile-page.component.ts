import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    FilterselectComponent,
  ],

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
  loading: boolean = true;
  private thaiLocationService?: ThaiLocationService;
  profilePicture: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  userId: number = -1;
  tier: string = '';
  emailerrMessage: string = '';
  emailValid: boolean = false;
  usernameduplicate: boolean = false;
  verifyPaymentTime: string = '';
  verifyPaymentTimeDate = {
    date : '',
    time : ''
  }
  vefrifyPayment :number = 1;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    thaiLocationService: ThaiLocationService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private location: Location
  ) {
    this.thaiLocationService = thaiLocationService;
    this.profileForm = this.fb.group({
      username: ['', [Validators.required]], // Example: username with min length
      email: ['', [Validators.required, Validators.email]], // Email validation
      firstName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÀ-ÿ\u0E00-\u0E7F]+$/), // Allows alphabetic characters and accented characters only
        ],
      ], // First name required
      lastName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÀ-ÿ\u0E00-\u0E7F]+$/), // Allows alphabetic characters and accented characters only
        ],
      ], // Last name required
      gender: ['', Validators.required], // Gender required
      birthDate: ['', Validators.required], // Birth date required
      telephone: ['', [Validators.required, Validators.pattern(/^0?\d{9}$/)]], // Phone number pattern
      notification: [1], // Default to true
      notiNews: [0], // Default to false
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

    // set data to form
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
          gender: response.gender,
          notiNews: response.notinews,
          notification: response.notification,
        });
        this.tier = response.tier;

        this.profileForm.disable();
        // clear profile picture
        if (this.profilePicture) {
          URL.revokeObjectURL(this.profilePicture);
        }

        this.userId = response.Id;

        // Get profile picture
        this.userService.getProfilePicture(this.userId).subscribe({
          next: (response) => {
            console.log('Profile picture:', response);

            const blob = new Blob([response], { type: response.type });
            this.profilePicture = URL.createObjectURL(blob);
            console.log(this.profilePicture);
            this.imagePreview = this.profilePicture;

            this.userService.checkVerifyPayment().subscribe({
              next: (data) => {
                console.log(data, 'payment data');
                this.verifyPaymentTime = data.submission_date;
                const dateObj = new Date(this.verifyPaymentTime);
                this.verifyPaymentTimeDate.date = dateObj.toLocaleDateString("th-TH");
                this.verifyPaymentTimeDate.time = dateObj.toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' });
                console.log(this.verifyPaymentTimeDate.date, this.verifyPaymentTimeDate.time, 'date and time');
                this.vefrifyPayment = data.verify_payment;

                this.loading = false;

                
              },
              error: (error) => {
                if (error.status === 404) {
                  this.verifyPaymentTime = '';
                  this.loading = false;
                }
              },
            });

          },
          error: (error) => {
            console.error(error);
            this.loading = false;

          },
        });
      },
      error: (error: any) => {
        console.error(error);
        this.loading = false;
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

  // clear profile memory  when component is destroyed
  ngOnDestroy() {
    if (this.profilePicture) {
      URL.revokeObjectURL(this.profilePicture);
    }
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Update the form control
      this.selectedFile = file;

      // Read the file and create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  startEditing() {
    this.sEditing = true;
    this.resetForm();
    this.imagePreview = this.profilePicture;
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
    
    this.loading = true;
    this.emailValid = true;
    this.usernameduplicate = true;

    this.checkEmail(this.profileForm.value.email, () => {
      this.checkUsername(this.profileForm.value.username, () => {
        this.uploadProfile();
      }
      );
    });



    
  }


  uploadProfile()
  {
    if (this.profileForm.valid) {
      this.sEditing = false;
      


      const profileUpdate: any = {
        Username: this.profileForm.value.username,
        Email: this.profileForm.value.email,
        FirstName: this.profileForm.value.firstName,
        LastName: this.profileForm.value.lastName,
        Gender: this.profileForm.value.gender,
        BirthDate: this.profileForm.value.birthDate,
        Telephone: this.profileForm.value.telephone,
        Notification: this.profileForm.value.notification ? 1 : 0,
        NotiNews: this.profileForm.value.notiNews ? 1 : 0,
        Province: this.profileForm.value.province,
        District: this.profileForm.value.district,
        Subdistrict: this.profileForm.value.sub_district,
        PostCode: this.profileForm.value.postcode,
        HomeNumber: this.profileForm.value.home_number,
        Alley: this.profileForm.value.alley,
        LandTypeFV: this.profileForm.value.interestLand,
      };
      console.log(profileUpdate);

      this.userService.updateUser(profileUpdate).subscribe({
        next: () => {
          const modal = document.getElementById(
            'noti_profile_update'
          ) as HTMLDialogElement;
          modal.showModal();

          if (this.selectedFile) {
            this.authService
              .uploadProfile(this.userId, this.selectedFile)
              .subscribe({
                next: (response) => {
                  this.loading = false;
                  console.log(response);
                },
                error: (error) => {
                  this.loading = false;
                  console.error(error);
                },
              });
          } else {
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message;
        },
      });

      this.profileForm.disable();
    } 
    else {
      this.loading = false;
      console.log(this.profileForm.value);

      const modal = document.getElementById(
        'warning_profile_update'
      ) as HTMLDialogElement;
      modal.showModal();
    }
  }

  reloadPage() {
    window.location.reload();
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById(
      'profilePicture'
    ) as HTMLInputElement;
    fileInput.click();
  }
  private resetForm() {}

  checkEmail(email: string, callback: () => void): void {
    this.authService.checkDuplicateEmail(email).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.emailValid = true;
        callback(); // Proceed to check username
      },
      error: (err) => {
        console.error('Error:', err);
        if (err.status === 409) {

          const modal = document.getElementById(
            'err_profile_update_2'
          ) as HTMLDialogElement;
          modal.showModal();

          this.loading = false;
        }
        this.emailValid = false;
      },
    });
  }

  checkUsername(username: string, callback: () => void): void {
    this.authService.checkDuplicateUsername(username).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.usernameduplicate = true;
        callback();
      },
      error: (err) => {
        console.error('Error:', err);
        if (err.status === 409) {
          const modal = document.getElementById(
            'err_profile_update_3'
          ) as HTMLDialogElement;
          modal.showModal();
          this.loading = false;
        }
        this.usernameduplicate = false;
      },
    });
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

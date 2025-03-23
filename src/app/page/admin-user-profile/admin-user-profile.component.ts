import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsermanagementService } from 'app/service/Usermanagement/usermanagement.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'app/service/User/user.service';
import { Router } from '@angular/router';

export interface UserPaymentDetails {
  UserID: string; // Assuming UserID is a string, change to number if necessary.
  Username: string;
  Email: string;
  FirstName: string;
  LastName: string;
  Gender: string;
  BirthDate: string; // ISO date string format, e.g., 'YYYY-MM-DD'. Use `Date` type if needed.
  Age: number;
  Telephone: string;
  HomeNumber: string;
  Alley: string;
  Subdistrict: string;
  District: string;
  PostCode: string;
  Province: string;
  Tier: string;
  SubmissionDate: string | "-"; // ISO date string or "-".
  Verified: boolean;
  Buytier: string;
}




@Component({
  selector: 'app-admin-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './admin-user-profile.component.html',
  styleUrl: './admin-user-profile.component.css'
})
export class AdminUserProfileComponent {
  userId!: number;
  userPaymentDetails!: UserPaymentDetails
  userupdateForm :FormGroup;
  tierForm:FormGroup;
  verifyForm:FormGroup;
  loading:boolean =true;
  profilePicture: string = '';
  paymentPicture: string | undefined ;
  slipImage: string ='';
  paidPrice!: number;

  constructor(private UMService:UsermanagementService,private route :ActivatedRoute ,private fb:FormBuilder, private userService: UserService,private router :Router) {
    this.userupdateForm = fb.group({
      username: ['', [Validators.required]], // Example: username with min length
      email: ['', [Validators.required, Validators.email]], // Email validation
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
    })

    this.tierForm = fb.group({
      Tier :['Basic']
    })
    this.verifyForm = fb.group({
      Verify:[0]
    })
   }

  ngOnInit() {
    // Retrieve the ID from the route
    this.route.params.subscribe(params => {
      this.userId = +params['id']; // Convert the ID to a number
      // Retrieve the profile picture after getting the user ID
      this.userService.getProfilePicture(this.userId).subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: response.type }); 
          this.profilePicture = URL.createObjectURL(blob);
        },
        error: (error) => {
          console.error(error);
        }
      });
      const userID = this.userId.toString();
      this.UMService.getLastPayment(userID).subscribe({
        next: (response) => {
      
          const blob = new Blob([response], { type: response.type }); 
          this.slipImage = URL.createObjectURL(blob);
          console.log(this.slipImage);
          

        },
        error: (error) => {
          console.error(error);
        },
      });
    })
    

    // Retrieve the user details
    this.UMService.getUserPayment(this.userId).subscribe(
      {
        next:(res) => {
          this.userPaymentDetails = res;
          console.log(this.userPaymentDetails,"userPaymentDetails");
          
          this.verifyForm.patchValue({
            Verify:this.userPaymentDetails.Verified
          })
          this.tierForm.patchValue({
            Tier:this.userPaymentDetails.Tier
          })

          if(this.userPaymentDetails.SubmissionDate =="-")
          {
            this.verifyForm.disable()
          }

          if (this.userPaymentDetails.Buytier == "Basic") {
            this.paidPrice = 0;
          }
          else if (this.userPaymentDetails.Buytier == "Tier1") {
            this.paidPrice = 99;
          }
          else if (this.userPaymentDetails.Buytier == "Tier2") {
            this.paidPrice = 299;
          }
          else if (this.userPaymentDetails.Buytier == "Tier3") {
            this.paidPrice = 499;
          }


          this.loading = false
        },
        error:(error) => {
          console.error(error);
        }
      }
    );
  }
  onEditUser()
  {
    this.userupdateForm.patchValue({
      username:this.userPaymentDetails.Username,
      email: this.userPaymentDetails.Email,
      firstName: this.userPaymentDetails.FirstName,
      lastName: this.userPaymentDetails.LastName,
      telephone: this.userPaymentDetails.Telephone,
      gender:this.userPaymentDetails.Gender,
      birthDate:this.userPaymentDetails.BirthDate,
    })
  }
  saveChange()
  { 
    const UserUpdate = {
      "Username":this.userupdateForm.value.username,
      "FirstName":this.userupdateForm.value.firstName,
      "LastName":this.userupdateForm.value.lastName,
      "Gender":this.userupdateForm.value.gender,
      "BirthDate":this.userupdateForm.value.birthDate,
      "Telephone":this.userupdateForm.value.telephone,
      "Email":this.userupdateForm.value.email
    }
    
    this.UMService.adminEditUser(this.userId,UserUpdate).subscribe(
      {
        next:(res)=>{
          console.log(res);
          window.location.reload();
        },
        error:(err)=>{
          console.log(err);
          
        }
      }
    )
    
  }
  tierUpdate()
  {
    const newTier = {
      "Tier":this.tierForm.value.Tier
    }
    this.UMService.updateTier(this.userId,newTier).subscribe(res=>{
      console.log(res);
      
    })
  }
  verficationUpdate()
  {
    const newVerification = {
      "Verified":this.verifyForm.value.Verify
    }
    this.UMService.updateverify(this.userId,newVerification).subscribe(res=>{
      console.log(res);
      
    })
  }
  deleteUser()
  {
    this.UMService.deleteUser(this.userId).subscribe(res=>{
      this.router.navigate(['/AdminUserManage']);
      
    })
  }



}

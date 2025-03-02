import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import { SunmitPayment } from 'model/payment.interface';
import { UserService } from 'app/service/User/user.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent {
  tier!: string;
  price = 0;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  paymentForm: FormGroup;
  submitted = false;
  paymentVerified = false;
  PaymentData = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router : Router
  ) {
    this.paymentForm = this.fb.group({
      AccName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      detail: new FormControl('', Validators.required),
    });

    this.route.params.subscribe((params) => {
      this.tier = params['tier'];
    });
    if (this.tier === 'Tier1') {
      this.price = 99;
    } else if (this.tier === 'Tier2') {
      this.price = 299;
    } else if (this.tier === 'Tier3') {
      this.price = 499;
    }
  }

  ngOnInit(): void {
    // check payment verified to prevent user from submitting payment proof multiple times while the previous payment is still being processed
    this.userService.checkVerifyPayment().subscribe(
      (data) => {
        console.log(data);
        
        if (data === 1) {
          this.paymentVerified = true;
        } else {
          this.paymentVerified = false
        }
      },
      (error) => {
        if (error.status === 404) {
          this.PaymentData = false;
        }
      }
    );
  }

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

  triggerFileInput(): void {
    const fileInput = document.getElementById(
      'profilePicture'
    ) as HTMLInputElement;
    fileInput.click();
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.selectedFile) {
      console.log('Please upload payment proof');
      
      return;
    }


    if (this.paymentForm.invalid) {
      return;
    }
    this.userService
      .getUserId()
      .pipe(first())
      .subscribe((data) => {
        const submitPayment: SunmitPayment = {
          UserID: data.toString(),
          BuyTier: this.tier,
          AccName: this.paymentForm.value.AccName,
          Telephone: this.paymentForm.value.phoneNumber,
          Detail: this.paymentForm.value.detail,
          PaidPrice: this.price.toString(),
        };
        
        if (this.selectedFile) {
          this.userService
            .uploadPaymentProof(submitPayment, this.selectedFile)
            .pipe(first())
            .subscribe((data) => {
              const modal = document.getElementById('noti_payment') as HTMLDialogElement;
              modal.showModal();
            });
        }
      });
  }
}

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
import { AuthService } from 'app/service/Auth/auth.service';

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
  userTier = 'Basic';
  loading = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router : Router,
    private auth : AuthService
  ) {
    this.paymentForm = this.fb.group({
      AccName: new FormControl('', [Validators.required,  Validators.pattern(/^[A-Za-zÀ-ÿ\u0E00-\u0E7F]+( [A-Za-zÀ-ÿ\u0E00-\u0E7F]+)?$/)
      ]),
      phoneNumber: new FormControl('', [Validators.required,Validators.pattern(/^0?\d{9}$/)]),
      detail: new FormControl('', ),
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

    this.auth.getTier().subscribe((response) => {
      this.userTier = response;
      this.loading = false;
    });

    // check payment verified to prevent user from submitting payment proof multiple times while the previous payment is still being processed
    this.userService.checkVerifyPayment().subscribe(
      (data) => {
        console.log(data,"payment data");
        
        this.paymentVerified = data.verify_payment;
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
    if (!this.selectedFile || this.paymentForm.invalid) {
      console.log('Please upload payment proof');
      const modal = document.getElementById('payment_err_1') as HTMLDialogElement;
      modal.showModal();
      return;
    }


    // if (this.paymentForm.invalid) {
    //   return;
    // }
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

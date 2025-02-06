import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent {
  tier!: string;
  price = 0;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.tier = params['tier'];
    });
    if (this.tier === 'Tier1') {
      this.price = 899;
    } else if (this.tier === 'Tier2') {
      this.price = 1499;
    } else if (this.tier === 'Tier3') {
      this.price = 2599;
    }
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
}

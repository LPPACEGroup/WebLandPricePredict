import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-payment',
  standalone: true,
  imports: [],
  templateUrl: './confirm-payment.component.html',
  styleUrl: './confirm-payment.component.css'
})
export class ConfirmPaymentComponent {


  @Output() close = new EventEmitter<void>();

  isVisible = true;
  title = '';
  content = '';

  closePopup() {
    this.isVisible = false;
    this.close.emit();
  }

  createBlog() {
    // Handle blog creation logic here
    console.log('Creating blog with:', { title: this.title, content: this.content });
    this.closePopup();
  }
}

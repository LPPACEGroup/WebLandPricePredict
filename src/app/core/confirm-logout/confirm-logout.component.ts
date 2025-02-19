import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-logout',
  standalone: true,
  imports: [],
  templateUrl: './confirm-logout.component.html',
  styleUrl: './confirm-logout.component.css'
})
export class ConfirmLogoutComponent {


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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-create-blog',
  standalone: true,
  imports: [],
  templateUrl: './admin-create-blog.component.html',
  styleUrl: './admin-create-blog.component.css'
})
export class AdminCreateBlogComponent {

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

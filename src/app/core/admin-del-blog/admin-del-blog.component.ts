import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-del-blog',
  standalone: true,
  imports: [],
  templateUrl: './admin-del-blog.component.html',
  styleUrl: './admin-del-blog.component.css'
})
export class AdminDelBlogComponent {

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

import { Component } from '@angular/core';
import { CollapseComponent } from '../../core/collapse/collapse.component';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from 'app/core/carousel/carousel.component';
import { BlogService } from 'app/service/Blog/blog.service';
import { Blog } from 'model/blog.interface';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CollapseComponent, CommonModule, CarouselComponent,CommonModule],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {
  blogList : Blog[] = [];
  searchBlogList : Blog[] = [];

  constructor(private blogService:BlogService) { }
  isDropdownVisible = false;

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  ngOnInit() {
    this.blogService.getBlogs().subscribe({

      next: (data) => {
        this.blogList = data;
        this.searchBlogList = data;
      }
    });
  }

  searchBlog(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    if (searchValue) {
      this.searchBlogList = this.blogList.filter(blog => 
        blog.Topic.includes(searchValue) || 
        blog.Content.includes(searchValue)
      );
    } else {
      this.searchBlogList = this.blogList;
    }
  }

}

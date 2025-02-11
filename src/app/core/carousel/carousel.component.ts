import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService } from 'app/service/Blog/blog.service';


@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  news :any;
  loading = true;

  images = [
    { src: '/assets/imgs/news1.png', alt: 'Slide 1' },
  ];

  currentIndex = 0;
  max = 2;

  constructor(private blogService:BlogService) {}

  ngOnInit(): void {
    this.autoSlide();
    this.blogService.getNews(10).subscribe({
      next: (data) => {
        this.news = data.map((item: any, index: number) => ({...item, index: index}));
        this.loading = false;
        this.max = this.news.length;
        console.log(this.news);
        console.log(this.max);
        
        
      }
    });
  }

  getTransform(): string {
    return `translateX(${-this.currentIndex * 100}%)`;
  }

  prevSlide(): void {
if (this.currentIndex>0){
this.currentIndex--;
}
else {
  this.currentIndex = this.max-1;
}
  }

  nextSlide(): void {
    if (this.currentIndex<this.max-1){
      this.currentIndex++;
      }
      else {
        this.currentIndex = 0;
      }  }

  autoSlide(): void {
    setInterval(() => {
      this.nextSlide();
    }, 3000); 
  }
}

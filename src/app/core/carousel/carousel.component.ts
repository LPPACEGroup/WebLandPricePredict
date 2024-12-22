import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  images = [
    { src: '/assets/imgs/news1.png', alt: 'Slide 1' },
  ];

  currentIndex = 0;
  max = 2;

  constructor() {}

  ngOnInit(): void {
    this.autoSlide();
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
    }, 3000); // Auto-slide every 3 seconds
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-carousel',
  standalone: true,
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  images = [
    { src: '/assets/imgs/news1.png', alt: 'Slide 1' },
  ];

  currentIndex = 0;

  constructor() {}

  ngOnInit(): void {
    this.autoSlide();
  }

  getTransform(): string {
    return `translateX(${-this.currentIndex * 100}%)`;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex === 0) ? this.images.length - 1 : this.currentIndex - 1;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex === this.images.length - 1) ? 0 : this.currentIndex + 1;
  }

  autoSlide(): void {
    setInterval(() => {
      this.nextSlide();
    }, 3000); // Auto-slide every 3 seconds
  }
}

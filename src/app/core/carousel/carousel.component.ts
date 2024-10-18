import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-carousel',
  standalone: true,
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  images = [
    { src: 'https://via.placeholder.com/600x300?text=Slide+1', alt: 'Slide 1' },
    { src: 'https://via.placeholder.com/600x300?text=Slide+2', alt: 'Slide 2' },
    { src: 'https://via.placeholder.com/600x300?text=Slide+3', alt: 'Slide 3' },
    { src: 'https://via.placeholder.com/600x300?text=Slide+4', alt: 'Slide 4' },
  ];

  currentIndex = 0;

  constructor() {}

  ngOnInit(): void {
    this.autoSlide();
  }

  getTransform(): string {
    return `translateX(${-this.currentIndex * 600}px)`;
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

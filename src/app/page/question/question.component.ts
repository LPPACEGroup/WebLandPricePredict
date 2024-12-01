import { Component } from '@angular/core';
import { CollapseComponent } from '../../core/collapse/collapse.component';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from 'app/core/carousel/carousel.component';


@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CollapseComponent, CommonModule, CarouselComponent],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {
  isDropdownVisible = false;

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

}

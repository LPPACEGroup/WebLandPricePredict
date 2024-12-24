import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-collapse',
  standalone: true,
  imports: [],
  templateUrl: './collapse.component.html',
  styleUrl: './collapse.component.css'
})
export class CollapseComponent {
  @Input() question_header!: string;
  @Input() content!: string;
  
  isContentVisible: boolean = false;

  toggleContentVisibility() {
    this.isContentVisible = !this.isContentVisible;
  }
}


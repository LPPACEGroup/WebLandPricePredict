import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-land-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './land-card.component.html',
  styleUrl: './land-card.component.css'
})
export class LandCardComponent {
  @Input() item: any;
  @Output() sendItem = new EventEmitter();
  fowllowState = false;

  onfollow() {
    this.fowllowState = !this.fowllowState;
  }

}

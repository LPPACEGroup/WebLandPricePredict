import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-land-card',
  standalone: true,
  imports: [],
  templateUrl: './land-card.component.html',
  styleUrl: './land-card.component.css'
})
export class LandCardComponent {
  @Input() item: any;

}

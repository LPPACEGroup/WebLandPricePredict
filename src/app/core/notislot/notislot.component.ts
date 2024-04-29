import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notislot',
  templateUrl: './notislot.component.html',
  styleUrls: ['./notislot.component.css'] // Use styleUrls instead of styleUrl
})
export class NotislotComponent {
  @Input() data!: string;
  @Input() newsType!: string;
  @Input() date!: string;
}

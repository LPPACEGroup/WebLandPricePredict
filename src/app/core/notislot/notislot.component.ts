import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-notislot',
  standalone: true,
  imports: [],
  templateUrl: './notislot.component.html',
  styleUrl: './notislot.component.css'
})
export class NotislotComponent {
  @Input() Topic: string = ''
  @Input() Date : Date = new Date()
  @Input() Link: string = '';
  

  constructor() {
    
  }

  ngOnInit() {
    
  }

}

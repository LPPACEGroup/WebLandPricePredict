import { Component } from '@angular/core';
import { NotislotModule } from '../notislot/notislot/notislot.module';

@Component({
  selector: 'app-noti',
  standalone: true,
  imports: [NotislotModule],
  templateUrl: './noti.component.html',
  styleUrl: './noti.component.css'
})
export class NotiComponent {

}

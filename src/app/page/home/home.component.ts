import { Component } from '@angular/core';
import { SvgIconModule } from '../../core/svg-icon/svg-icon/svg-icon.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SvgIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
  
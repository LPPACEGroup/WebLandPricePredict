import { Component } from '@angular/core';
import { SvgIconModule } from '../../core/svg-icon/svg-icon/svg-icon.module';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [SvgIconModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {

}

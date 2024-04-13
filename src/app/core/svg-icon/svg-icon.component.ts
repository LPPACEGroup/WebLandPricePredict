import { Component,Input} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  imports: [],
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.css'
})
export class SvgIconComponent {
  @Input() iconName: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  getSvgUrl(): SafeResourceUrl {
    console.log(`./assets/img/home.png`)
    // return this.sanitizer.bypassSecurityTrustResourceUrl(`./assets/icons/${this.iconName}.svg`);
    return this.sanitizer.bypassSecurityTrustResourceUrl(`./assets/img/home.png`);

  }

}

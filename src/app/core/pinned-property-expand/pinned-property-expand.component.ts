import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-pinned-property-expand',
  standalone: true,
  imports: [],
  templateUrl: './pinned-property-expand.component.html',
  styleUrl: './pinned-property-expand.component.css'
})
export class PinnedPropertyExpandComponent {
 @Input() land: any;
  isDropdownVisible: boolean = false;



  toggleDropdown() {

    this.isDropdownVisible = !this.isDropdownVisible;

  }
}

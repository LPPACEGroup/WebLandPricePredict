import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild ,OnInit, forwardRef} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-filterselect',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './filterselect.component.html',
  styleUrl: './filterselect.component.css', providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterselectComponent),
      multi: true,
    },
  ],
})
export class FilterselectComponent {
  @ViewChild('input') input?: ElementRef<HTMLInputElement>;
  @Input() label: any[] = [];
  // @Input() myControl!: FormControl;
  @Input() myControl: FormControl = new FormControl();
  @Input() placeholder: string = '';
  // myControl = new FormControl('');
  selectValue: string = '';
  Options: string[] = [];

  filteredOptions: string[] = [];

  ngOnInit() {
    // Initialize Options and filteredOptions after input is set
    this.Options = this.label.map(item => item.toString());
    this.filteredOptions = [...this.label];
    
  }


  filter(): void {
    const filterValue = this.input?.nativeElement.value.toLowerCase() || '';
    this.filteredOptions = this.Options.filter((o) =>
      o.toLowerCase().includes(filterValue)
    );
  }
}

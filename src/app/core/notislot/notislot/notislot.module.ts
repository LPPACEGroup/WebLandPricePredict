import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotislotComponent } from '../notislot.component';

@NgModule({
  declarations: [NotislotComponent],
  imports: [CommonModule],
  exports: [NotislotComponent] // Export the component to make it available for other modules
})
export class NotislotModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MapComponent } from './map.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MapComponent
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }
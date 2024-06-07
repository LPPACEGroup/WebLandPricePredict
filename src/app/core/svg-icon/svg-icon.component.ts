import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-svg-icon',
  template: '<ng-content></ng-content>',
})
export class SvgIconComponent implements OnInit {
  @Input() iconName!: string;

  constructor(private httpClient: HttpClient, private elementRef: ElementRef) {}

  ngOnInit() {
    this.httpClient.get(`assets/icons/${this.iconName}.svg`, { responseType: 'text' }).subscribe(data => {
      this.elementRef.nativeElement.innerHTML = data;
    });
  }
}
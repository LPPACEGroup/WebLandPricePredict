import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterselectComponent } from './filterselect.component';

describe('FilterselectComponent', () => {
  let component: FilterselectComponent;
  let fixture: ComponentFixture<FilterselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterselectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

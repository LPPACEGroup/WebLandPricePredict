import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinnedPropertyExpandComponent } from './pinned-property-expand.component';

describe('PinnedPropertyExpandComponent', () => {
  let component: PinnedPropertyExpandComponent;
  let fixture: ComponentFixture<PinnedPropertyExpandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinnedPropertyExpandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PinnedPropertyExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

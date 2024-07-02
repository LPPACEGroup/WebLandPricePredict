import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandCardComponent } from './land-card.component';

describe('LandCardComponent', () => {
  let component: LandCardComponent;
  let fixture: ComponentFixture<LandCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

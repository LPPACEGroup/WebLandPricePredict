import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanMaximumComponent } from './loan-maximum.component';

describe('LoanMaximumComponent', () => {
  let component: LoanMaximumComponent;
  let fixture: ComponentFixture<LoanMaximumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanMaximumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanMaximumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

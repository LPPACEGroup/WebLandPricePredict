import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanCompareComponent } from './loan-compare.component';

describe('LoanCompareComponent', () => {
  let component: LoanCompareComponent;
  let fixture: ComponentFixture<LoanCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanCompareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

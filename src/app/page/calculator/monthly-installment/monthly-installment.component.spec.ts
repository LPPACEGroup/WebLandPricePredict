import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyInstallmentComponent } from './monthly-installment.component';

describe('MonthlyInstallmentComponent', () => {
  let component: MonthlyInstallmentComponent;
  let fixture: ComponentFixture<MonthlyInstallmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyInstallmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthlyInstallmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { LoanCalculatorComponent } from './loan-calculator/loan-calculator.component';
import { LoanCompareComponent } from './loan-compare/loan-compare.component';
import { RefinanceComponent } from './refinance/refinance.component';
import { APRComponent } from './apr/apr.component';
import { MonthlyInstallmentComponent } from './monthly-installment/monthly-installment.component';
import { LoanMaximumComponent } from './loan-maximum/loan-maximum.component';
import { AuthService } from 'app/service/Auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [MatTabsModule,LoanCalculatorComponent,LoanCompareComponent,RefinanceComponent,APRComponent,MonthlyInstallmentComponent,LoanMaximumComponent,CommonModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  loading = true;
  tier!:string ;

  constructor(private auth :AuthService) {}
  ngOnInit() {
    this.auth.getTier().subscribe({
      next: (response: any) => {
        this.tier = response;
        this.loading = false;
        
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

}

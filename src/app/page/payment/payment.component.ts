import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  tier!: string;
  price = 0;
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.tier = params['tier'];});
      if (this.tier === 'Tier1') {
        this.price = 899;
      }
      else if (this.tier === 'Tier2') {
        this.price = 1499;
      }
      else if (this.tier === 'Tier3') {
        this.price = 2599;
      }}
      
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APRComponent } from './apr.component';

describe('APRComponent', () => {
  let component: APRComponent;
  let fixture: ComponentFixture<APRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [APRComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(APRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

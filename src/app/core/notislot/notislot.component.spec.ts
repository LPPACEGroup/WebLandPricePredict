import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotislotComponent } from './notislot.component';

describe('NotislotComponent', () => {
  let component: NotislotComponent;
  let fixture: ComponentFixture<NotislotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotislotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotislotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

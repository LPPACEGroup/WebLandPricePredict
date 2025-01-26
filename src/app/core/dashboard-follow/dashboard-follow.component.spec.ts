import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFollowComponent } from './dashboard-follow.component';

describe('DashboardFollowComponent', () => {
  let component: DashboardFollowComponent;
  let fixture: ComponentFixture<DashboardFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFollowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

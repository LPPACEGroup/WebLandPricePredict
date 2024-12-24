import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSuggestComponent } from './admin-suggest.component';

describe('AdminSuggestComponent', () => {
  let component: AdminSuggestComponent;
  let fixture: ComponentFixture<AdminSuggestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSuggestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

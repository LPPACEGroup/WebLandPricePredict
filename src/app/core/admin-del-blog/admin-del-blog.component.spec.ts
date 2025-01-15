import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDelBlogComponent } from './admin-del-blog.component';

describe('AdminDelBlogComponent', () => {
  let component: AdminDelBlogComponent;
  let fixture: ComponentFixture<AdminDelBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDelBlogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDelBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

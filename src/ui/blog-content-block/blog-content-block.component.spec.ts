import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogContentBlockComponent } from './blog-content-block.component';

describe('BlogContentBlockComponent', () => {
  let component: BlogContentBlockComponent;
  let fixture: ComponentFixture<BlogContentBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogContentBlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogContentBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

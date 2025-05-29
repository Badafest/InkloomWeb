import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogStudioComponent } from './blog-studio.component';

describe('StudioComponent', () => {
  let component: BlogStudioComponent;
  let fixture: ComponentFixture<BlogStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogStudioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

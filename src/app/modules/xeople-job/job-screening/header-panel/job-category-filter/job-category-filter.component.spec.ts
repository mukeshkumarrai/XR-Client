import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCategoryFilterComponent } from './job-category-filter.component';

describe('JobCategoryFilterComponent', () => {
  let component: JobCategoryFilterComponent;
  let fixture: ComponentFixture<JobCategoryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCategoryFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCategoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

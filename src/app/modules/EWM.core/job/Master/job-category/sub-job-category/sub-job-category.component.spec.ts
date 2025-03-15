import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubJobCategoryComponent } from './sub-job-category.component';

describe('SubJobCategoryComponent', () => {
  let component: SubJobCategoryComponent;
  let fixture: ComponentFixture<SubJobCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubJobCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubJobCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

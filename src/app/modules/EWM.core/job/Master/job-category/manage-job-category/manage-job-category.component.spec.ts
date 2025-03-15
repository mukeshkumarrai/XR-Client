import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobCategoryComponent } from './manage-job-category.component';

describe('ManageJobCategoryComponent', () => {
  let component: ManageJobCategoryComponent;
  let fixture: ComponentFixture<ManageJobCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageJobCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageJobCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

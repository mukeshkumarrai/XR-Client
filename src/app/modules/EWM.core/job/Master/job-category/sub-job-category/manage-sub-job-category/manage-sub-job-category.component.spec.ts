import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSubJobCategoryComponent } from './manage-sub-job-category.component';

describe('ManageSubJobCategoryComponent', () => {
  let component: ManageSubJobCategoryComponent;
  let fixture: ComponentFixture<ManageSubJobCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSubJobCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSubJobCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

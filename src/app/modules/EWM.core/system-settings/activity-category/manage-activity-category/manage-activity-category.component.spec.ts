import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageActivityCategoryComponent } from './manage-activity-category.component';

describe('ManageActivityCategoryComponent', () => {
  let component: ManageActivityCategoryComponent;
  let fixture: ComponentFixture<ManageActivityCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageActivityCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageActivityCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageExperienceTypeComponent } from './manage-experience-type.component';

describe('ManageExperienceTypeComponent', () => {
  let component: ManageExperienceTypeComponent;
  let fixture: ComponentFixture<ManageExperienceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageExperienceTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageExperienceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

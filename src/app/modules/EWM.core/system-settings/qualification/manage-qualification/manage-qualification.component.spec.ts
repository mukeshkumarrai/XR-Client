import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQualificationComponent } from './manage-qualification.component';

describe('ManageQualificationComponent', () => {
  let component: ManageQualificationComponent;
  let fixture: ComponentFixture<ManageQualificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageQualificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

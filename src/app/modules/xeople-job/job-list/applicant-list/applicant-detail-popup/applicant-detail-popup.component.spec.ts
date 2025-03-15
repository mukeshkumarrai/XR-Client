import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantDetailPopupComponent } from './applicant-detail-popup.component';

describe('ApplicantDetailPopupComponent', () => {
  let component: ApplicantDetailPopupComponent;
  let fixture: ComponentFixture<ApplicantDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantDetailPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

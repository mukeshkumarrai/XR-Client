import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateEmergencyContactsComponent } from './candidate-emergency-contacts.component';

describe('CandidateEmergencyContactsComponent', () => {
  let component: CandidateEmergencyContactsComponent;
  let fixture: ComponentFixture<CandidateEmergencyContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateEmergencyContactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateEmergencyContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatePersonalInformationComponent } from './candidate-personal-information.component';

describe('CandidatePersonalInformationComponent', () => {
  let component: CandidatePersonalInformationComponent;
  let fixture: ComponentFixture<CandidatePersonalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidatePersonalInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatePersonalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

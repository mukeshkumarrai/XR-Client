import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateResumeParseComponent } from './candidate-resume-parse.component';

describe('CandidateResumeParseComponent', () => {
  let component: CandidateResumeParseComponent;
  let fixture: ComponentFixture<CandidateResumeParseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateResumeParseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateResumeParseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

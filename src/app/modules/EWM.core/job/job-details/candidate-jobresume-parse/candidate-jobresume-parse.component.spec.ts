import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateJobresumeParseComponent } from './candidate-jobresume-parse.component';

describe('CandidateJobresumeParseComponent', () => {
  let component: CandidateJobresumeParseComponent;
  let fixture: ComponentFixture<CandidateJobresumeParseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateJobresumeParseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateJobresumeParseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

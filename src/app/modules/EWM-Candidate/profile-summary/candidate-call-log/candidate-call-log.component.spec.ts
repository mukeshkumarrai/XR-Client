import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateCallLogComponent } from './candidate-call-log.component';

describe('CandidateCallLogComponent', () => {
  let component: CandidateCallLogComponent;
  let fixture: ComponentFixture<CandidateCallLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateCallLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateCallLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

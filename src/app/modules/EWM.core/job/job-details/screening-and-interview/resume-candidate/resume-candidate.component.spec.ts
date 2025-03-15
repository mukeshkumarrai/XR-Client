import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeCandidateComponent } from './resume-candidate.component';

describe('ResumeCandidateComponent', () => {
  let component: ResumeCandidateComponent;
  let fixture: ComponentFixture<ResumeCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionJobNotesComponent } from './job-action-job-notes.component';

describe('JobActionJobNotesComponent', () => {
  let component: JobActionJobNotesComponent;
  let fixture: ComponentFixture<JobActionJobNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActionJobNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActionJobNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

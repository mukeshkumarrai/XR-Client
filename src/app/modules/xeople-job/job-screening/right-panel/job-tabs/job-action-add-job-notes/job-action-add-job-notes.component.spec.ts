import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionAddJobNotesComponent } from './job-action-add-job-notes.component';

describe('JobActionAddJobNotesComponent', () => {
  let component: JobActionAddJobNotesComponent;
  let fixture: ComponentFixture<JobActionAddJobNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActionAddJobNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActionAddJobNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

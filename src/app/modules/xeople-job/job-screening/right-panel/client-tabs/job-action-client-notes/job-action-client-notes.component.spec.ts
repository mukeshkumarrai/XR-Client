import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionClientNotesComponent } from './job-action-client-notes.component';

describe('JobActionClientNotesComponent', () => {
  let component: JobActionClientNotesComponent;
  let fixture: ComponentFixture<JobActionClientNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActionClientNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActionClientNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionAddClientNotesComponent } from './job-action-add-client-notes.component';

describe('JobActionAddClientNotesComponent', () => {
  let component: JobActionAddClientNotesComponent;
  let fixture: ComponentFixture<JobActionAddClientNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActionAddClientNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActionAddClientNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

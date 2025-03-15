import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobNoteComponent } from './job-note.component';

describe('JobNoteComponent', () => {
  let component: JobNoteComponent;
  let fixture: ComponentFixture<JobNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

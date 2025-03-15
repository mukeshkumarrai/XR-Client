import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobNoteListComponent } from './job-note-list.component';

describe('JobNoteListComponent', () => {
  let component: JobNoteListComponent;
  let fixture: ComponentFixture<JobNoteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobNoteListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

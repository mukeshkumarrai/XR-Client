import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionClientDocumentsComponent } from './job-action-client-documents.component';

describe('JobActionClientDocumentsComponent', () => {
  let component: JobActionClientDocumentsComponent;
  let fixture: ComponentFixture<JobActionClientDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActionClientDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActionClientDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

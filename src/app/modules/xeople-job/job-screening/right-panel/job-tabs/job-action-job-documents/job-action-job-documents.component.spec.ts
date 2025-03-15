import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionJobDocumentsComponent } from './job-action-job-documents.component';

describe('JobActionJobDocumentsComponent', () => {
  let component: JobActionJobDocumentsComponent;
  let fixture: ComponentFixture<JobActionJobDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActionJobDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActionJobDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDocumentComponent } from './job-document.component';

describe('JobDocumentComponent', () => {
  let component: JobDocumentComponent;
  let fixture: ComponentFixture<JobDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

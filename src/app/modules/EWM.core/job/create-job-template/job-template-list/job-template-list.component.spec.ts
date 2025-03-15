import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTemplateListComponent } from './job-template-list.component';

describe('JobTemplateListComponent', () => {
  let component: JobTemplateListComponent;
  let fixture: ComponentFixture<JobTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobTemplateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

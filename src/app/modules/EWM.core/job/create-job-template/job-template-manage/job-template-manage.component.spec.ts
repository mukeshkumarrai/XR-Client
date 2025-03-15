import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTemplateManageComponent } from './job-template-manage.component';

describe('JobTemplateManageComponent', () => {
  let component: JobTemplateManageComponent;
  let fixture: ComponentFixture<JobTemplateManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobTemplateManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTemplateManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

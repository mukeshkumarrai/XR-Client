import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobManageComponent } from './job-manage.component';

describe('JobManageComponent', () => {
  let component: JobManageComponent;
  let fixture: ComponentFixture<JobManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

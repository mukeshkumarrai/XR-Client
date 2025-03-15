import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDeatilsHeaderStatusComponent } from './job-deatils-header-status.component';

describe('JobDeatilsHeaderStatusComponent', () => {
  let component: JobDeatilsHeaderStatusComponent;
  let fixture: ComponentFixture<JobDeatilsHeaderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDeatilsHeaderStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDeatilsHeaderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

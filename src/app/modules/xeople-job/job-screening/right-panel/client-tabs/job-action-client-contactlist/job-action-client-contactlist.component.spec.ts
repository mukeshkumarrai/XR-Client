import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionClientContactlistComponent } from './job-action-client-contactlist.component';

describe('JobActionClientContactlistComponent', () => {
  let component: JobActionClientContactlistComponent;
  let fixture: ComponentFixture<JobActionClientContactlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActionClientContactlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActionClientContactlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

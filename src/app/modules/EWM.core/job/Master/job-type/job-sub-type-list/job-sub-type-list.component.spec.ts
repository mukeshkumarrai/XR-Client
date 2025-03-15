import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSubTypeListComponent } from './job-sub-type-list.component';

describe('JobSubTypeListComponent', () => {
  let component: JobSubTypeListComponent;
  let fixture: ComponentFixture<JobSubTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobSubTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSubTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

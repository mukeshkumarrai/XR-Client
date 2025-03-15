import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTabActionComponent } from './job-tab-action.component';

describe('JobTabActionComponent', () => {
  let component: JobTabActionComponent;
  let fixture: ComponentFixture<JobTabActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobTabActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTabActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

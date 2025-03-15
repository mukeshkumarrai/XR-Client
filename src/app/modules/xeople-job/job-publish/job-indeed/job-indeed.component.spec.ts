import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobIndeedComponent } from './job-indeed.component';

describe('JobIndeedComponent', () => {
  let component: JobIndeedComponent;
  let fixture: ComponentFixture<JobIndeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobIndeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobIndeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

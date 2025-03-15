import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTypeAddComponent } from './job-type-add.component';

describe('JobTypeAddComponent', () => {
  let component: JobTypeAddComponent;
  let fixture: ComponentFixture<JobTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobTypeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSubTypeAddComponent } from './job-sub-type-add.component';

describe('JobSubTypeAddComponent', () => {
  let component: JobSubTypeAddComponent;
  let fixture: ComponentFixture<JobSubTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobSubTypeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSubTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

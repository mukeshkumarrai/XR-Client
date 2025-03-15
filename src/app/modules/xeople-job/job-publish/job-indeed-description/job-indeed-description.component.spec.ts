import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobIndeedDescriptionComponent } from './job-indeed-description.component';

describe('JobIndeedDescriptionComponent', () => {
  let component: JobIndeedDescriptionComponent;
  let fixture: ComponentFixture<JobIndeedDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobIndeedDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobIndeedDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

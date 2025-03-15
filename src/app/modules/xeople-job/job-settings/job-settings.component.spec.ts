import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSettingsComponent } from './job-settings.component';

describe('JobSettingsComponent', () => {
  let component: JobSettingsComponent;
  let fixture: ComponentFixture<JobSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

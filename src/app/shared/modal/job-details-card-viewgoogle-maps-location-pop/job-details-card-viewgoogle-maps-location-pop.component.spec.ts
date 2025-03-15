import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailsCardViewgoogleMapsLocationPopComponent } from './job-details-card-viewgoogle-maps-location-pop.component';

describe('JobDetailsCardViewgoogleMapsLocationPopComponent', () => {
  let component: JobDetailsCardViewgoogleMapsLocationPopComponent;
  let fixture: ComponentFixture<JobDetailsCardViewgoogleMapsLocationPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDetailsCardViewgoogleMapsLocationPopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailsCardViewgoogleMapsLocationPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

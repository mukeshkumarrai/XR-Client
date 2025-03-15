import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapsLocationPopComponent } from './google-maps-location-pop.component';

describe('GoogleMapsLocationPopComponent', () => {
  let component: GoogleMapsLocationPopComponent;
  let fixture: ComponentFixture<GoogleMapsLocationPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleMapsLocationPopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapsLocationPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

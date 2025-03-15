import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMeetIntegrationComponent } from './google-meet-integration.component';

describe('GoogleMeetIntegrationComponent', () => {
  let component: GoogleMeetIntegrationComponent;
  let fixture: ComponentFixture<GoogleMeetIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleMeetIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMeetIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

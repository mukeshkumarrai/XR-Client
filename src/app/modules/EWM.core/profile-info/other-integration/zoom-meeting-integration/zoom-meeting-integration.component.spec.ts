import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomMeetingIntegrationComponent } from './zoom-meeting-integration.component';

describe('ZoomMeetingIntegrationComponent', () => {
  let component: ZoomMeetingIntegrationComponent;
  let fixture: ComponentFixture<ZoomMeetingIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomMeetingIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomMeetingIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

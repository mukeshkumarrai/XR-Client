import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAssistanceDatePopupComponent } from './schedule-assistance-date-popup.component';

describe('ScheduleAssistanceDatePopupComponent', () => {
  let component: ScheduleAssistanceDatePopupComponent;
  let fixture: ComponentFixture<ScheduleAssistanceDatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleAssistanceDatePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleAssistanceDatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

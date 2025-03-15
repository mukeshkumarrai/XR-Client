import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertPopupAutoFillAppResumeComponent } from './alert-popup-auto-fill-app-resume.component';

describe('AlertPopupAutoFillAppResumeComponent', () => {
  let component: AlertPopupAutoFillAppResumeComponent;
  let fixture: ComponentFixture<AlertPopupAutoFillAppResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertPopupAutoFillAppResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertPopupAutoFillAppResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

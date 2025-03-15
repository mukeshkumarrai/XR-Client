import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAlertMessageComponent } from './application-alert-message.component';

describe('ApplicationAlertMessageComponent', () => {
  let component: ApplicationAlertMessageComponent;
  let fixture: ComponentFixture<ApplicationAlertMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationAlertMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationAlertMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

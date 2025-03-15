import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpiredLoginComponent } from './session-expired-login.component';

describe('SessionExpiredLoginComponent', () => {
  let component: SessionExpiredLoginComponent;
  let fixture: ComponentFixture<SessionExpiredLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionExpiredLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExpiredLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

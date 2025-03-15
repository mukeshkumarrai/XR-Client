import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionSwitchingComponent } from './session-switching.component';

describe('SessionSwitchingComponent', () => {
  let component: SessionSwitchingComponent;
  let fixture: ComponentFixture<SessionSwitchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionSwitchingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionSwitchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

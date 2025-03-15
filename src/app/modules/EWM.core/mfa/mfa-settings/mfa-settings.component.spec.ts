import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfaSettingsComponent } from './mfa-settings.component';

describe('MfaSettingsComponent', () => {
  let component: MfaSettingsComponent;
  let fixture: ComponentFixture<MfaSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfaSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MfaSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

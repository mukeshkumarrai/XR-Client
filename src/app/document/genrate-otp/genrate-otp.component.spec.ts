import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenrateOtpComponent } from './genrate-otp.component';

describe('GenrateOtpComponent', () => {
  let component: GenrateOtpComponent;
  let fixture: ComponentFixture<GenrateOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenrateOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenrateOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

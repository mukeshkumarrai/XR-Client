import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCaptchaComponent } from './common-captcha.component';

describe('CommonCaptchaComponent', () => {
  let component: CommonCaptchaComponent;
  let fixture: ComponentFixture<CommonCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonCaptchaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewForgotPasswordComponent } from './new-forgot-password.component';

describe('NewForgotPasswordComponent', () => {
  let component: NewForgotPasswordComponent;
  let fixture: ComponentFixture<NewForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewForgotPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

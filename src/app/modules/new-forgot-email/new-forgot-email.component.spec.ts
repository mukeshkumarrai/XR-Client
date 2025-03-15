import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewForgotEmailComponent } from './new-forgot-email.component';

describe('NewForgotEmailComponent', () => {
  let component: NewForgotEmailComponent;
  let fixture: ComponentFixture<NewForgotEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewForgotEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewForgotEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

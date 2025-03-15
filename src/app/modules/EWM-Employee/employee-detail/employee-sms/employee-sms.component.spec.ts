import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSmsComponent } from './employee-sms.component';

describe('EmployeeSmsComponent', () => {
  let component: EmployeeSmsComponent;
  let fixture: ComponentFixture<EmployeeSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

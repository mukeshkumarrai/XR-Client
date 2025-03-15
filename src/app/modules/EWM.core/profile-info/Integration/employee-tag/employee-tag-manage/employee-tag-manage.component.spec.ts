import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTagManageComponent } from './employee-tag-manage.component';

describe('EmployeeTagManageComponent', () => {
  let component: EmployeeTagManageComponent;
  let fixture: ComponentFixture<EmployeeTagManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTagManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTagManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

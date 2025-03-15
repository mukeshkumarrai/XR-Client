import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeManageNameComponent } from './employee-manage-name.component';

describe('EmployeeManageNameComponent', () => {
  let component: EmployeeManageNameComponent;
  let fixture: ComponentFixture<EmployeeManageNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeManageNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeManageNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

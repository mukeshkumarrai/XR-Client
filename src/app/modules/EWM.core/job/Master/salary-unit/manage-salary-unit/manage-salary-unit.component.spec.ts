import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSalaryUnitComponent } from './manage-salary-unit.component';

describe('ManageSalaryUnitComponent', () => {
  let component: ManageSalaryUnitComponent;
  let fixture: ComponentFixture<ManageSalaryUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSalaryUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSalaryUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

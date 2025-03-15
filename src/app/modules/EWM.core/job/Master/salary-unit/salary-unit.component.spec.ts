import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryUnitComponent } from './salary-unit.component';

describe('SalaryUnitComponent', () => {
  let component: SalaryUnitComponent;
  let fixture: ComponentFixture<SalaryUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

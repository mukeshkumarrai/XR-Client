import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSalaryBandComponent } from './manage-salary-band.component';

describe('ManageSalaryBandComponent', () => {
  let component: ManageSalaryBandComponent;
  let fixture: ComponentFixture<ManageSalaryBandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSalaryBandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSalaryBandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

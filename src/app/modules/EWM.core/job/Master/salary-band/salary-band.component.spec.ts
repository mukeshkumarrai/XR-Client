import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryBandComponent } from './salary-band.component';

describe('SalaryBandComponent', () => {
  let component: SalaryBandComponent;
  let fixture: ComponentFixture<SalaryBandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryBandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryBandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

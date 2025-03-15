import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonFilterDiologComponent } from './common-filter-diolog.component';

describe('CommonFilterDiologComponent', () => {
  let component: CommonFilterDiologComponent;
  let fixture: ComponentFixture<CommonFilterDiologComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonFilterDiologComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonFilterDiologComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

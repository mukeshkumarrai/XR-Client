import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNgSelectCurrencyComponent } from './custom-ng-select-currency.component';

describe('CustomNgSelectCurrencyComponent', () => {
  let component: CustomNgSelectCurrencyComponent;
  let fixture: ComponentFixture<CustomNgSelectCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomNgSelectCurrencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomNgSelectCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

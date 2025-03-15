import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFormatComponent } from './address-format.component';

describe('AddressFormatComponent', () => {
  let component: AddressFormatComponent;
  let fixture: ComponentFixture<AddressFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressFormatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

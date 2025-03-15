import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeDropdownWithTwoVariabelComponent } from './custome-dropdown-with-two-variabel.component';

describe('CustomeDropdownWithTwoVariabelComponent', () => {
  let component: CustomeDropdownWithTwoVariabelComponent;
  let fixture: ComponentFixture<CustomeDropdownWithTwoVariabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomeDropdownWithTwoVariabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeDropdownWithTwoVariabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

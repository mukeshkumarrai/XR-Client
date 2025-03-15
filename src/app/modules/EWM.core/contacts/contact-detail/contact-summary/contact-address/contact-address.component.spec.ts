import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAddressComponent } from './contact-address.component';

describe('ContactAddressComponent', () => {
  let component: ContactAddressComponent;
  let fixture: ComponentFixture<ContactAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

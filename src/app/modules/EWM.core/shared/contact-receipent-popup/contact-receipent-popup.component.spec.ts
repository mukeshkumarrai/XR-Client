import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactReceipentPopupComponent } from './contact-receipent-popup.component';

describe('ContactReceipentPopupComponent', () => {
  let component: ContactReceipentPopupComponent;
  let fixture: ComponentFixture<ContactReceipentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactReceipentPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactReceipentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

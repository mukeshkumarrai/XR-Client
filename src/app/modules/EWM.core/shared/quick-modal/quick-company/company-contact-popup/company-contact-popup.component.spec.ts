import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyContactPopupComponent } from './company-contact-popup.component';

describe('CompanyContactPopupComponent', () => {
  let component: CompanyContactPopupComponent;
  let fixture: ComponentFixture<CompanyContactPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyContactPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyContactPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

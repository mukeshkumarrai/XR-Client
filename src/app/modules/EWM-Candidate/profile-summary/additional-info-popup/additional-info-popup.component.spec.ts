import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalInfoPopupComponent } from './additional-info-popup.component';

describe('AdditionalInfoPopupComponent', () => {
  let component: AdditionalInfoPopupComponent;
  let fixture: ComponentFixture<AdditionalInfoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalInfoPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

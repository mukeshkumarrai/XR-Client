import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLatLongDistancePopupComponent } from './custom-lat-long-distance-popup.component';

describe('CustomLatLongDistancePopupComponent', () => {
  let component: CustomLatLongDistancePopupComponent;
  let fixture: ComponentFixture<CustomLatLongDistancePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomLatLongDistancePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomLatLongDistancePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

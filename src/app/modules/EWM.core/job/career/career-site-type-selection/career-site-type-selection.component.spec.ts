import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerSiteTypeSelectionComponent } from './career-site-type-selection.component';

describe('CareerSiteTypeSelectionComponent', () => {
  let component: CareerSiteTypeSelectionComponent;
  let fixture: ComponentFixture<CareerSiteTypeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerSiteTypeSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerSiteTypeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

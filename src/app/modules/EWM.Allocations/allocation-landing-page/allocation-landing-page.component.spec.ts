import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationLandingPageComponent } from './allocation-landing-page.component';

describe('AllocationLandingPageComponent', () => {
  let component: AllocationLandingPageComponent;
  let fixture: ComponentFixture<AllocationLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocationLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocationLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

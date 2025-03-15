import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceLandingPageComponent } from './finance-landing-page.component';

describe('FinanceLandingPageComponent', () => {
  let component: FinanceLandingPageComponent;
  let fixture: ComponentFixture<FinanceLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

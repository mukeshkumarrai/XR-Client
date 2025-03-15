import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentLandingPageComponent } from './assessment-landing-page.component';

describe('AssessmentLandingPageComponent', () => {
  let component: AssessmentLandingPageComponent;
  let fixture: ComponentFixture<AssessmentLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingApplicationFormComponent } from './landing-application-form.component';

describe('LandingApplicationFormComponent', () => {
  let component: LandingApplicationFormComponent;
  let fixture: ComponentFixture<LandingApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingApplicationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

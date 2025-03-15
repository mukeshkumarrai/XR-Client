import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentLandingPageComponent } from './recruitment-landing-page.component';

describe('RecruitmentLandingPageComponent', () => {
  let component: RecruitmentLandingPageComponent;
  let fixture: ComponentFixture<RecruitmentLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruitmentLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

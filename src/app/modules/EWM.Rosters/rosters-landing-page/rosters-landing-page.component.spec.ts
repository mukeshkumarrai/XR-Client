import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RostersLandingPageComponent } from './rosters-landing-page.component';

describe('RostersLandingPageComponent', () => {
  let component: RostersLandingPageComponent;
  let fixture: ComponentFixture<RostersLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RostersLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RostersLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

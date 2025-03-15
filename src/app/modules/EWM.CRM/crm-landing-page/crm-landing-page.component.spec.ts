import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmLandingPageComponent } from './crm-landing-page.component';

describe('CrmLandingPageComponent', () => {
  let component: CrmLandingPageComponent;
  let fixture: ComponentFixture<CrmLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

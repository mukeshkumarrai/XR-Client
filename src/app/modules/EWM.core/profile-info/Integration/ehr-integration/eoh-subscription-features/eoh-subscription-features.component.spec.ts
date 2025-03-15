import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EohSubscriptionFeaturesComponent } from './eoh-subscription-features.component';

describe('EohSubscriptionFeaturesComponent', () => {
  let component: EohSubscriptionFeaturesComponent;
  let fixture: ComponentFixture<EohSubscriptionFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EohSubscriptionFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EohSubscriptionFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

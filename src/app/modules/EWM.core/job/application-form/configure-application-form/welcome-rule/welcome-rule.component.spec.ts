import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeRuleComponent } from './welcome-rule.component';

describe('WelcomeRuleComponent', () => {
  let component: WelcomeRuleComponent;
  let fixture: ComponentFixture<WelcomeRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

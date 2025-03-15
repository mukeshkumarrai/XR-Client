import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureRuleEmailTemplateComponent } from './configure-rule-email-template.component';

describe('ConfigureRuleEmailTemplateComponent', () => {
  let component: ConfigureRuleEmailTemplateComponent;
  let fixture: ComponentFixture<ConfigureRuleEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureRuleEmailTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureRuleEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

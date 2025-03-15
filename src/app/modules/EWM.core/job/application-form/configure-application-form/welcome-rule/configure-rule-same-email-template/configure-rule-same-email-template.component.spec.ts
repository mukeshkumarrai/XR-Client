import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureRuleSameEmailTemplateComponent } from './configure-rule-same-email-template.component';

describe('ConfigureRuleSameEmailTemplateComponent', () => {
  let component: ConfigureRuleSameEmailTemplateComponent;
  let fixture: ComponentFixture<ConfigureRuleSameEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureRuleSameEmailTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureRuleSameEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

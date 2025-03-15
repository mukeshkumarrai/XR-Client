import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentReqEmailTemplateComponent } from './consent-req-email-template.component';

describe('ConsentReqEmailTemplateComponent', () => {
  let component: ConsentReqEmailTemplateComponent;
  let fixture: ComponentFixture<ConsentReqEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentReqEmailTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentReqEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

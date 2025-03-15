import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplatesManageComponent } from './email-templates-manage.component';

describe('EmailTemplatesManageComponent', () => {
  let component: EmailTemplatesManageComponent;
  let fixture: ComponentFixture<EmailTemplatesManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailTemplatesManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplatesManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

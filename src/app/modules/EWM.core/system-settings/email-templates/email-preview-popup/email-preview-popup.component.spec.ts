import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPreviewPopupComponent } from './email-preview-popup.component';

describe('EmailPreviewPopupComponent', () => {
  let component: EmailPreviewPopupComponent;
  let fixture: ComponentFixture<EmailPreviewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailPreviewPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPreviewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

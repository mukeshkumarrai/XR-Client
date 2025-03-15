import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAttachmentPopupComponent } from './custom-attachment-popup.component';

describe('CustomAttachmentPopupComponent', () => {
  let component: CustomAttachmentPopupComponent;
  let fixture: ComponentFixture<CustomAttachmentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomAttachmentPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAttachmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

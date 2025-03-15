import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttachmentPopupComponent } from './view-attachment-popup.component';

describe('ViewAttachmentPopupComponent', () => {
  let component: ViewAttachmentPopupComponent;
  let fixture: ComponentFixture<ViewAttachmentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAttachmentPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAttachmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPopupApplyComponent } from './document-popup-apply.component';

describe('DocumentPopupApplyComponent', () => {
  let component: DocumentPopupApplyComponent;
  let fixture: ComponentFixture<DocumentPopupApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentPopupApplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPopupApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

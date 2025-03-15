import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentChecklistComponent } from './upload-document-checklist.component';

describe('UploadDocumentChecklistComponent', () => {
  let component: UploadDocumentChecklistComponent;
  let fixture: ComponentFixture<UploadDocumentChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDocumentChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

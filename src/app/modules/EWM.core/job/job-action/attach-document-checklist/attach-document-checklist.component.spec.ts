import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachDocumentChecklistComponent } from './attach-document-checklist.component';

describe('AttachDocumentChecklistComponent', () => {
  let component: AttachDocumentChecklistComponent;
  let fixture: ComponentFixture<AttachDocumentChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachDocumentChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachDocumentChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

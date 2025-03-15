import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentEmailTemplateComponent } from './document-email-template.component';

describe('DocumentEmailTemplateComponent', () => {
  let component: DocumentEmailTemplateComponent;
  let fixture: ComponentFixture<DocumentEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentEmailTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

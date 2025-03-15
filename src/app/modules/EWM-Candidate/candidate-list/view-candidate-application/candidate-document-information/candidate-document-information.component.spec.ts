import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDocumentInformationComponent } from './candidate-document-information.component';

describe('CandidateDocumentInformationComponent', () => {
  let component: CandidateDocumentInformationComponent;
  let fixture: ComponentFixture<CandidateDocumentInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateDocumentInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDocumentInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

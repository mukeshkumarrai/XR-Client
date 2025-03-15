import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDocumentComponent } from './candidate-document.component';

describe('CandidateDocumentComponent', () => {
  let component: CandidateDocumentComponent;
  let fixture: ComponentFixture<CandidateDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

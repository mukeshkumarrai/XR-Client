import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParsedResumeKeywordSearchComponent } from './parsed-resume-keyword-search.component';

describe('ParsedResumeKeywordSearchComponent', () => {
  let component: ParsedResumeKeywordSearchComponent;
  let fixture: ComponentFixture<ParsedResumeKeywordSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParsedResumeKeywordSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParsedResumeKeywordSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

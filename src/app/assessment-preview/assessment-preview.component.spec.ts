import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentPreviewComponent } from './assessment-preview.component';

describe('AssessmentPreviewComponent', () => {
  let component: AssessmentPreviewComponent;
  let fixture: ComponentFixture<AssessmentPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

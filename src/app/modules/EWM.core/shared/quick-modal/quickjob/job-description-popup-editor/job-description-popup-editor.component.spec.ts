import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDescriptionPopupEditorComponent } from './job-description-popup-editor.component';

describe('JobDescriptionPopupEditorComponent', () => {
  let component: JobDescriptionPopupEditorComponent;
  let fixture: ComponentFixture<JobDescriptionPopupEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDescriptionPopupEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDescriptionPopupEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

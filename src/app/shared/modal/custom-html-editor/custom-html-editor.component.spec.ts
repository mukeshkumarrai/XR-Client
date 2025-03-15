import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHtmlEditorComponent } from './custom-html-editor.component';

describe('CustomHtmlEditorComponent', () => {
  let component: CustomHtmlEditorComponent;
  let fixture: ComponentFixture<CustomHtmlEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomHtmlEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomHtmlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

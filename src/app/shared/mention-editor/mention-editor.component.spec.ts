import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionEditorComponent } from './mention-editor.component';

describe('MentionEditorComponent', () => {
  let component: MentionEditorComponent;
  let fixture: ComponentFixture<MentionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentionEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

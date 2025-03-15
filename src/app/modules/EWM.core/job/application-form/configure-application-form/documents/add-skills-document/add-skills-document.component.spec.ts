import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkillsDocumentComponent } from './add-skills-document.component';

describe('AddSkillsDocumentComponent', () => {
  let component: AddSkillsDocumentComponent;
  let fixture: ComponentFixture<AddSkillsDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSkillsDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSkillsDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

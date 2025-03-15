import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillTagPopupComponent } from './skill-tag-popup.component';

describe('SkillTagPopupComponent', () => {
  let component: SkillTagPopupComponent;
  let fixture: ComponentFixture<SkillTagPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillTagPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillTagPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

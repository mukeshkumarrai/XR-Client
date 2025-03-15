import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillPopupComponent } from './skill-popup.component';

describe('SkillPopupComponent', () => {
  let component: SkillPopupComponent;
  let fixture: ComponentFixture<SkillPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

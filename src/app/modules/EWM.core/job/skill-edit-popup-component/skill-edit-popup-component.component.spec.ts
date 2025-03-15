import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillEditPopupComponentComponent } from './skill-edit-popup-component.component';

describe('SkillEditPopupComponentComponent', () => {
  let component: SkillEditPopupComponentComponent;
  let fixture: ComponentFixture<SkillEditPopupComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillEditPopupComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillEditPopupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

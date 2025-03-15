import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSkillConfirmationPopupComponent } from './group-skill-confirmation-popup.component';

describe('GroupSkillConfirmationPopupComponent', () => {
  let component: GroupSkillConfirmationPopupComponent;
  let fixture: ComponentFixture<GroupSkillConfirmationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupSkillConfirmationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSkillConfirmationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

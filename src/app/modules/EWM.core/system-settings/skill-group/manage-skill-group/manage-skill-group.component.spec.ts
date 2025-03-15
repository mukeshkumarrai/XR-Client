import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSkillGroupComponent } from './manage-skill-group.component';

describe('ManageSkillGroupComponent', () => {
  let component: ManageSkillGroupComponent;
  let fixture: ComponentFixture<ManageSkillGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSkillGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSkillGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

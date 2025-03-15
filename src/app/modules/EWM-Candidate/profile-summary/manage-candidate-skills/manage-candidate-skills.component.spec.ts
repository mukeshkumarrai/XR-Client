import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCandidateSkillsComponent } from './manage-candidate-skills.component';

describe('ManageCandidateSkillsComponent', () => {
  let component: ManageCandidateSkillsComponent;
  let fixture: ComponentFixture<ManageCandidateSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCandidateSkillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCandidateSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

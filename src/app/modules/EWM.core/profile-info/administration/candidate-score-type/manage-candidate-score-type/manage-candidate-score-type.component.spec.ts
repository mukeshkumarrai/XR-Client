import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCandidateScoreTypeComponent } from './manage-candidate-score-type.component';
describe('ManageCandidateScoreTypeComponent', () => {
  let component: ManageCandidateScoreTypeComponent;
  let fixture: ComponentFixture<ManageCandidateScoreTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCandidateScoreTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCandidateScoreTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

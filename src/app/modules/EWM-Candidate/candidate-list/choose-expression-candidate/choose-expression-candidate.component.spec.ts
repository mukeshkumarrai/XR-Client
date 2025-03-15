import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseExpressionCandidateComponent } from './choose-expression-candidate.component';

describe('ChooseExpressionCandidateComponent', () => {
  let component: ChooseExpressionCandidateComponent;
  let fixture: ComponentFixture<ChooseExpressionCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseExpressionCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseExpressionCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

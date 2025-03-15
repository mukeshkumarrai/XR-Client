import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentQuesComponent } from './assessment-ques.component';

describe('AssessmentQuesComponent', () => {
  let component: AssessmentQuesComponent;
  let fixture: ComponentFixture<AssessmentQuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentQuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentQuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

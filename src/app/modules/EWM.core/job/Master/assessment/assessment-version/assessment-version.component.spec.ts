import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentVersionComponent } from './assessment-version.component';

describe('AssessmentVersionComponent', () => {
  let component: AssessmentVersionComponent;
  let fixture: ComponentFixture<AssessmentVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentVersionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

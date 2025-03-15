import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDegreeTypeComponent } from './candidate-degree-type.component';

describe('CandidateDegreeTypeComponent', () => {
  let component: CandidateDegreeTypeComponent;
  let fixture: ComponentFixture<CandidateDegreeTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateDegreeTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDegreeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

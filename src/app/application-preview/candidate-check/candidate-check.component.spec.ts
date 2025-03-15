import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateCheckComponent } from './candidate-check.component';

describe('CandidateCheckComponent', () => {
  let component: CandidateCheckComponent;
  let fixture: ComponentFixture<CandidateCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

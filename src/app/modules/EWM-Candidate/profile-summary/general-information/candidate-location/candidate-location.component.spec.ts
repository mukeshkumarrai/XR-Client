import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateLocationComponent } from './candidate-location.component';

describe('CandidateLocationComponent', () => {
  let component: CandidateLocationComponent;
  let fixture: ComponentFixture<CandidateLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

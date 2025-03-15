import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSourceComponent } from './candidate-source.component';

describe('CandidateSourceComponent', () => {
  let component: CandidateSourceComponent;
  let fixture: ComponentFixture<CandidateSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

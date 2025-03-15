import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictCandidateComponent } from './restrict-candidate.component';

describe('RestrictCandidateComponent', () => {
  let component: RestrictCandidateComponent;
  let fixture: ComponentFixture<RestrictCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestrictCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

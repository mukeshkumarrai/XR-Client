import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCandidateApplicationComponent } from './view-candidate-application.component';

describe('ViewCandidateApplicationComponent', () => {
  let component: ViewCandidateApplicationComponent;
  let fixture: ComponentFixture<ViewCandidateApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCandidateApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCandidateApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

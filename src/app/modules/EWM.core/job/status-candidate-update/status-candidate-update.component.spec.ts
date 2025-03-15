import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCandidateUpdateComponent } from './status-candidate-update.component';

describe('StatusCandidateUpdateComponent', () => {
  let component: StatusCandidateUpdateComponent;
  let fixture: ComponentFixture<StatusCandidateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusCandidateUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusCandidateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCandidateComponent } from './remove-candidate.component';

describe('RemoveCandidateComponent', () => {
  let component: RemoveCandidateComponent;
  let fixture: ComponentFixture<RemoveCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

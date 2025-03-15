import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveMultipleCandidateComponent } from './remove-multiple-candidate.component';

describe('RemoveMultipleCandidateComponent', () => {
  let component: RemoveMultipleCandidateComponent;
  let fixture: ComponentFixture<RemoveMultipleCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveMultipleCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveMultipleCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

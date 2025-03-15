import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapApplicationFormCandidateComponent } from './map-application-form-candidate.component';

describe('MapApplicationFormCandidateComponent', () => {
  let component: MapApplicationFormCandidateComponent;
  let fixture: ComponentFixture<MapApplicationFormCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapApplicationFormCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapApplicationFormCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

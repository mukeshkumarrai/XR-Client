import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTypesComponent } from './location-types.component';

describe('LocationTypesComponent', () => {
  let component: LocationTypesComponent;
  let fixture: ComponentFixture<LocationTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

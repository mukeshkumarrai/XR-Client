import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTypesOperationComponent } from './location-types-operation.component';

describe('LocationTypesOperationComponent', () => {
  let component: LocationTypesOperationComponent;
  let fixture: ComponentFixture<LocationTypesOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationTypesOperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTypesOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

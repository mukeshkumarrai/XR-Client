import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapApplicationFormComponent } from './map-application-form.component';

describe('MapApplicationFormComponent', () => {
  let component: MapApplicationFormComponent;
  let fixture: ComponentFixture<MapApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapApplicationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapApplicationFormSeekComponent } from './map-application-form-seek.component';

describe('MapApplicationFormSeekComponent', () => {
  let component: MapApplicationFormSeekComponent;
  let fixture: ComponentFixture<MapApplicationFormSeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapApplicationFormSeekComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapApplicationFormSeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

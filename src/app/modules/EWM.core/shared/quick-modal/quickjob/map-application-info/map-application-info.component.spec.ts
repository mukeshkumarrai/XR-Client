import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapApplicationInfoComponent } from './map-application-info.component';

describe('MapApplicationInfoComponent', () => {
  let component: MapApplicationInfoComponent;
  let fixture: ComponentFixture<MapApplicationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapApplicationInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapApplicationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

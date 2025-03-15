import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapChecklistComponent } from './map-checklist.component';

describe('MapChecklistComponent', () => {
  let component: MapChecklistComponent;
  let fixture: ComponentFixture<MapChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProximitySearchComponent } from './proximity-search.component';

describe('ProximitySearchComponent', () => {
  let component: ProximitySearchComponent;
  let fixture: ComponentFixture<ProximitySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProximitySearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProximitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

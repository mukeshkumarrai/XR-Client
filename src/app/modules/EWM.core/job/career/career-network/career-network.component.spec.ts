import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerNetworkComponent } from './career-network.component';

describe('CareerNetworkComponent', () => {
  let component: CareerNetworkComponent;
  let fixture: ComponentFixture<CareerNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerNetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

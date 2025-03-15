import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionmasterComponent } from './positionmaster.component';

describe('PositionmasterComponent', () => {
  let component: PositionmasterComponent;
  let fixture: ComponentFixture<PositionmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

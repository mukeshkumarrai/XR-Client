import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadbeanComponent } from './broadbean.component';

describe('BroadbeanComponent', () => {
  let component: BroadbeanComponent;
  let fixture: ComponentFixture<BroadbeanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadbeanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadbeanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

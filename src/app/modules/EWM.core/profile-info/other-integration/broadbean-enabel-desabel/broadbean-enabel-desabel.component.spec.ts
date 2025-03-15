import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadbeanEnabelDesabelComponent } from './broadbean-enabel-desabel.component';

describe('BroadbeanEnabelDesabelComponent', () => {
  let component: BroadbeanEnabelDesabelComponent;
  let fixture: ComponentFixture<BroadbeanEnabelDesabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadbeanEnabelDesabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadbeanEnabelDesabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

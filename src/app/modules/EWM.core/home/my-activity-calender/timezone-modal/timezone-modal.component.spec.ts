import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezoneModalComponent } from './timezone-modal.component';

describe('TimezoneModalComponent', () => {
  let component: TimezoneModalComponent;
  let fixture: ComponentFixture<TimezoneModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimezoneModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimezoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDrawerComponent } from './activity-drawer.component';

describe('ActivityDrawerComponent', () => {
  let component: ActivityDrawerComponent;
  let fixture: ComponentFixture<ActivityDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

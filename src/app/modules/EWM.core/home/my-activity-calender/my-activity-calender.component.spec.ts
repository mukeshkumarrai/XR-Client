import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyActivityCalenderComponent } from './my-activity-calender.component';

describe('MyActivityCalenderComponent', () => {
  let component: MyActivityCalenderComponent;
  let fixture: ComponentFixture<MyActivityCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyActivityCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyActivityCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

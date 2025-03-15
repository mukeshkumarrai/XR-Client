import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFilterActivityComponent } from './date-filter-activity.component';

describe('DateFilterActivityComponent', () => {
  let component: DateFilterActivityComponent;
  let fixture: ComponentFixture<DateFilterActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateFilterActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFilterActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

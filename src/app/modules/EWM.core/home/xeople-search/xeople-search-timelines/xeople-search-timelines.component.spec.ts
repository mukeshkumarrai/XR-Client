import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleSearchTimelinesComponent } from './xeople-search-timelines.component';

describe('XeopleSearchTimelinesComponent', () => {
  let component: XeopleSearchTimelinesComponent;
  let fixture: ComponentFixture<XeopleSearchTimelinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleSearchTimelinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleSearchTimelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

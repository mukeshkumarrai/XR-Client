import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleSearchActivityComponent } from './xeople-search-activity.component';

describe('XeopleSearchActivityComponent', () => {
  let component: XeopleSearchActivityComponent;
  let fixture: ComponentFixture<XeopleSearchActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleSearchActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleSearchActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

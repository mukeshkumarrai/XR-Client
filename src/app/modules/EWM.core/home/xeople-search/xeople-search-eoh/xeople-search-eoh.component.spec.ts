import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleSearchEOHComponent } from './xeople-search-eoh.component';

describe('XeopleSearchEOHComponent', () => {
  let component: XeopleSearchEOHComponent;
  let fixture: ComponentFixture<XeopleSearchEOHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleSearchEOHComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleSearchEOHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

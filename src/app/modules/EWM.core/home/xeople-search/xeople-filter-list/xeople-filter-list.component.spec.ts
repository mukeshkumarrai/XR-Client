import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleFilterListComponent } from './xeople-filter-list.component';

describe('XeopleFilterListComponent', () => {
  let component: XeopleFilterListComponent;
  let fixture: ComponentFixture<XeopleFilterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleFilterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

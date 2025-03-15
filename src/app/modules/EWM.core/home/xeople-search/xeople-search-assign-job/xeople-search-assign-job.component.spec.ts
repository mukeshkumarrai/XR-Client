import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleSearchAssignJobComponent } from './xeople-search-assign-job.component';

describe('XeopleSearchAssignJobComponent', () => {
  let component: XeopleSearchAssignJobComponent;
  let fixture: ComponentFixture<XeopleSearchAssignJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleSearchAssignJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleSearchAssignJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

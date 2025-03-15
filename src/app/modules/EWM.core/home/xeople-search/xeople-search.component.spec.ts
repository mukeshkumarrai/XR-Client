import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleSearchComponent } from './xeople-search.component';

describe('XeopleSearchComponent', () => {
  let component: XeopleSearchComponent;
  let fixture: ComponentFixture<XeopleSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

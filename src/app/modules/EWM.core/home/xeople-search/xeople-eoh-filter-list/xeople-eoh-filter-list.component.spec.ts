import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleEohFilterListComponent } from './xeople-eoh-filter-list.component';

describe('XeopleEohFilterListComponent', () => {
  let component: XeopleEohFilterListComponent;
  let fixture: ComponentFixture<XeopleEohFilterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleEohFilterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleEohFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

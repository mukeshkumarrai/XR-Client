import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleEohSaveFilterComponent } from './xeople-eoh-save-filter.component';

describe('XeopleEohSaveFilterComponent', () => {
  let component: XeopleEohSaveFilterComponent;
  let fixture: ComponentFixture<XeopleEohSaveFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleEohSaveFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleEohSaveFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

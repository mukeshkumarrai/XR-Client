import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleSearchMsgComponent } from './xeople-search-msg.component';

describe('XeopleSearchMsgComponent', () => {
  let component: XeopleSearchMsgComponent;
  let fixture: ComponentFixture<XeopleSearchMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleSearchMsgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleSearchMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

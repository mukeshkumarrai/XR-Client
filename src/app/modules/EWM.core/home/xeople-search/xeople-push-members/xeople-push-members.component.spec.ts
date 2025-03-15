import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeoplePushMembersComponent } from './xeople-push-members.component';

describe('XeoplePushMembersComponent', () => {
  let component: XeoplePushMembersComponent;
  let fixture: ComponentFixture<XeoplePushMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeoplePushMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeoplePushMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

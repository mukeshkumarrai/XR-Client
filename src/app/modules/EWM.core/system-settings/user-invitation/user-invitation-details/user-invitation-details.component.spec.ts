import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInvitationDetailsComponent } from './user-invitation-details.component';

describe('UserInvitationDetailsComponent', () => {
  let component: UserInvitationDetailsComponent;
  let fixture: ComponentFixture<UserInvitationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInvitationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInvitationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

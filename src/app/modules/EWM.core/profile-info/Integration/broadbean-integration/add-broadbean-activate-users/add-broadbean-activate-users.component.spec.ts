import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBroadbeanActivateUsersComponent } from './add-broadbean-activate-users.component';

describe('AddBroadbeanActivateUsersComponent', () => {
  let component: AddBroadbeanActivateUsersComponent;
  let fixture: ComponentFixture<AddBroadbeanActivateUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBroadbeanActivateUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBroadbeanActivateUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteATeammateComponent } from './invite-a-teammate.component';

describe('InviteATeammateComponent', () => {
  let component: InviteATeammateComponent;
  let fixture: ComponentFixture<InviteATeammateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteATeammateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteATeammateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

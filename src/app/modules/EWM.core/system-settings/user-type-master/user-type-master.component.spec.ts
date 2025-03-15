import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTypeMasterComponent } from './user-type-master.component';

describe('UserTypeMasterComponent', () => {
  let component: UserTypeMasterComponent;
  let fixture: ComponentFixture<UserTypeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTypeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

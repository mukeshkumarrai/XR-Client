import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPrefrencesComponent } from './account-prefrences.component';

describe('AccountPrefrencesComponent', () => {
  let component: AccountPrefrencesComponent;
  let fixture: ComponentFixture<AccountPrefrencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountPrefrencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPrefrencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

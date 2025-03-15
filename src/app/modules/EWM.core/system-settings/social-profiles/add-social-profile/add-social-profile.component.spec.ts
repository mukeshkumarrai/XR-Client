import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSocialProfileComponent } from './add-social-profile.component';

describe('AddSocialProfileComponent', () => {
  let component: AddSocialProfileComponent;
  let fixture: ComponentFixture<AddSocialProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSocialProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSocialProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

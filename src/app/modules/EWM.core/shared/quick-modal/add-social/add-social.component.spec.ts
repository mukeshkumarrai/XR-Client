import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSocialComponent } from './add-social.component';

describe('AddSocialComponent', () => {
  let component: AddSocialComponent;
  let fixture: ComponentFixture<AddSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSocialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

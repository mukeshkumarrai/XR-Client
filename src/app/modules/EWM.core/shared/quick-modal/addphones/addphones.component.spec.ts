import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddphonesComponent } from './addphones.component';

describe('AddphonesComponent', () => {
  let component: AddphonesComponent;
  let fixture: ComponentFixture<AddphonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddphonesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddphonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

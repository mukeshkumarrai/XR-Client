import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleSmartEmailComponent } from './xeople-smart-email.component';

describe('XeopleSmartEmailComponent', () => {
  let component: XeopleSmartEmailComponent;
  let fixture: ComponentFixture<XeopleSmartEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleSmartEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleSmartEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

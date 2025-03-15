import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSmshistroyComponent } from './contact-smshistroy.component';

describe('ContactSmshistroyComponent', () => {
  let component: ContactSmshistroyComponent;
  let fixture: ComponentFixture<ContactSmshistroyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactSmshistroyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSmshistroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

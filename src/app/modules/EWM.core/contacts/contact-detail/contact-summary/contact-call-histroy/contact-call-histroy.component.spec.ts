import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCallHistroyComponent } from './contact-call-histroy.component';

describe('ContactCallHistroyComponent', () => {
  let component: ContactCallHistroyComponent;
  let fixture: ComponentFixture<ContactCallHistroyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactCallHistroyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCallHistroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactClientsComponent } from './contact-clients.component';

describe('ContactClientsComponent', () => {
  let component: ContactClientsComponent;
  let fixture: ComponentFixture<ContactClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactClientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

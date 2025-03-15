import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientContactListComponent } from './client-contact-list.component';

describe('ClientContactListComponent', () => {
  let component: ClientContactListComponent;
  let fixture: ComponentFixture<ClientContactListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientContactListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

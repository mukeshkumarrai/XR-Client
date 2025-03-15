import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInboxComponent } from './client-inbox.component';

describe('ClientInboxComponent', () => {
  let component: ClientInboxComponent;
  let fixture: ComponentFixture<ClientInboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientInboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

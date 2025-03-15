import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBulkSmsComponent } from './client-bulk-sms.component';

describe('ClientBulkSmsComponent', () => {
  let component: ClientBulkSmsComponent;
  let fixture: ComponentFixture<ClientBulkSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientBulkSmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBulkSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBulkEmailComponent } from './client-bulk-email.component';

describe('ClientBulkEmailComponent', () => {
  let component: ClientBulkEmailComponent;
  let fixture: ComponentFixture<ClientBulkEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientBulkEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBulkEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

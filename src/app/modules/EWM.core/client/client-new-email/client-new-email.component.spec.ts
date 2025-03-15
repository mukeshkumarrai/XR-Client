import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientNewEmailComponent } from './client-new-email.component';

describe('ClientNewEmailComponent', () => {
  let component: ClientNewEmailComponent;
  let fixture: ComponentFixture<ClientNewEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientNewEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientNewEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

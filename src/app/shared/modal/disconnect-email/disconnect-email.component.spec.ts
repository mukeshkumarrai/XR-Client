import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisconnectEmailComponent } from './disconnect-email.component';

describe('DisconnectEmailComponent', () => {
  let component: DisconnectEmailComponent;
  let fixture: ComponentFixture<DisconnectEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisconnectEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisconnectEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

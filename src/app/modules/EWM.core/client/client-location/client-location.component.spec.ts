import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLocationComponent } from './client-location.component';

describe('ClientLocationComponent', () => {
  let component: ClientLocationComponent;
  let fixture: ComponentFixture<ClientLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

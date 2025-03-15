import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTabActionComponent } from './client-tab-action.component';

describe('ClientTabActionComponent', () => {
  let component: ClientTabActionComponent;
  let fixture: ComponentFixture<ClientTabActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientTabActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTabActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

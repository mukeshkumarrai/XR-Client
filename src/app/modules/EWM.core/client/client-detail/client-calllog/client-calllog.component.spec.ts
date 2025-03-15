import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCalllogComponent } from './client-calllog.component';

describe('ClientCalllogComponent', () => {
  let component: ClientCalllogComponent;
  let fixture: ComponentFixture<ClientCalllogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientCalllogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCalllogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

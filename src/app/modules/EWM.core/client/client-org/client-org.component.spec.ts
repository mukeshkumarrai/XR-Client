import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOrgComponent } from './client-org.component';

describe('ClientOrgComponent', () => {
  let component: ClientOrgComponent;
  let fixture: ComponentFixture<ClientOrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientOrgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

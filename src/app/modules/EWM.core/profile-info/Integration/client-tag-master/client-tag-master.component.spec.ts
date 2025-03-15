import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTagMasterComponent } from './client-tag-master.component';

describe('ClientTagMasterComponent', () => {
  let component: ClientTagMasterComponent;
  let fixture: ComponentFixture<ClientTagMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientTagMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTagMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

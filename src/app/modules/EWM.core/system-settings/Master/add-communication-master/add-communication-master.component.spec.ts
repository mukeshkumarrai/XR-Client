import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommunicationMasterComponent } from './add-communication-master.component';

describe('AddCommunicationMasterComponent', () => {
  let component: AddCommunicationMasterComponent;
  let fixture: ComponentFixture<AddCommunicationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCommunicationMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommunicationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

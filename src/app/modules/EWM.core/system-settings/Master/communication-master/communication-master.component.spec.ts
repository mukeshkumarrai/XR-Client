import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationMasterComponent } from './communication-master.component';

describe('CommunicationMasterComponent', () => {
  let component: CommunicationMasterComponent;
  let fixture: ComponentFixture<CommunicationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunicationMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

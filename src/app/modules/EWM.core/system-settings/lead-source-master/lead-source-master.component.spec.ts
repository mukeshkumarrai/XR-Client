import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSourceMasterComponent } from './lead-source-master.component';

describe('LeadSourceMasterComponent', () => {
  let component: LeadSourceMasterComponent;
  let fixture: ComponentFixture<LeadSourceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadSourceMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadSourceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

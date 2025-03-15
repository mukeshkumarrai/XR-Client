import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeadSourceMasterComponent } from './add-lead-source-master.component';

describe('AddLeadSourceMasterComponent', () => {
  let component: AddLeadSourceMasterComponent;
  let fixture: ComponentFixture<AddLeadSourceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLeadSourceMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLeadSourceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

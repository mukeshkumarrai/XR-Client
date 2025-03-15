import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSmsTemplatesComponent } from './manage-sms-templates.component';

describe('ManageSmsTemplatesComponent', () => {
  let component: ManageSmsTemplatesComponent;
  let fixture: ComponentFixture<ManageSmsTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSmsTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSmsTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

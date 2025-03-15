import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAddCallLogComponent } from './common-add-call-log.component';

describe('CommonAddCallLogComponent', () => {
  let component: CommonAddCallLogComponent;
  let fixture: ComponentFixture<CommonAddCallLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonAddCallLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAddCallLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VxtAddCallLogComponent } from './vxt-add-call-log.component';

describe('VxtAddCallLogComponent', () => {
  let component: VxtAddCallLogComponent;
  let fixture: ComponentFixture<VxtAddCallLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VxtAddCallLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VxtAddCallLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

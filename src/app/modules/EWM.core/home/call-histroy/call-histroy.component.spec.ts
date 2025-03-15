import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallHistroyComponent } from './call-histroy.component';

describe('CallHistroyComponent', () => {
  let component: CallHistroyComponent;
  let fixture: ComponentFixture<CallHistroyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallHistroyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallHistroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

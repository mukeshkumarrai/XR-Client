import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomCallHistoryComponent } from './zoom-call-history.component';

describe('ZoomCallHistoryComponent', () => {
  let component: ZoomCallHistoryComponent;
  let fixture: ComponentFixture<ZoomCallHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomCallHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomCallHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

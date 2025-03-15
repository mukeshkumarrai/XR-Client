import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkDoneActivityComponent } from './mark-done-activity.component';

describe('MarkDoneActivityComponent', () => {
  let component: MarkDoneActivityComponent;
  let fixture: ComponentFixture<MarkDoneActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkDoneActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkDoneActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

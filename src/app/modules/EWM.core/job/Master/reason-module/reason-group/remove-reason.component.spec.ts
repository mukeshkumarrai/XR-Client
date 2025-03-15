import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveReasonComponent } from './remove-reason.component';

describe('RemoveReasonComponent', () => {
  let component: RemoveReasonComponent;
  let fixture: ComponentFixture<RemoveReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

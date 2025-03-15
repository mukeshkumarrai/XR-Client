import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeoplerAssingJobComponent } from './xeopler-assing-job.component';

describe('XeoplerAssingJobComponent', () => {
  let component: XeoplerAssingJobComponent;
  let fixture: ComponentFixture<XeoplerAssingJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeoplerAssingJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeoplerAssingJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

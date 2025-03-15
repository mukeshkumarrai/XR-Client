import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyJobComponent } from './copy-job.component';

describe('CopyJobComponent', () => {
  let component: CopyJobComponent;
  let fixture: ComponentFixture<CopyJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

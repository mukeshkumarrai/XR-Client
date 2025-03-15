import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareResumeInternalComponent } from './share-resume-internal.component';

describe('ShareResumeInternalComponent', () => {
  let component: ShareResumeInternalComponent;
  let fixture: ComponentFixture<ShareResumeInternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareResumeInternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareResumeInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

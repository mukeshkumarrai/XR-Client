import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareJobApplicationUrlComponent } from './share-job-application-url.component';

describe('ShareJobApplicationUrlComponent', () => {
  let component: ShareJobApplicationUrlComponent;
  let fixture: ComponentFixture<ShareJobApplicationUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareJobApplicationUrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareJobApplicationUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

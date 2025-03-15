import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickJobLocationComponent } from './quick-job-location.component';

describe('QuickJobLocationComponent', () => {
  let component: QuickJobLocationComponent;
  let fixture: ComponentFixture<QuickJobLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickJobLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickJobLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

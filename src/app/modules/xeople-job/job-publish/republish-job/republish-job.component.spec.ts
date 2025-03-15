import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepublishJobComponent } from './republish-job.component';

describe('RepublishJobComponent', () => {
  let component: RepublishJobComponent;
  let fixture: ComponentFixture<RepublishJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepublishJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepublishJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

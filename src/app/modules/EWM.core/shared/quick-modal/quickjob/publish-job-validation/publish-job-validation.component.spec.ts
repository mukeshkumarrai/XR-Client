import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishJobValidationComponent } from './publish-job-validation.component';

describe('PublishJobValidationComponent', () => {
  let component: PublishJobValidationComponent;
  let fixture: ComponentFixture<PublishJobValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishJobValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishJobValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParsedResumeComponent } from './parsed-resume.component';

describe('ParsedResumeComponent', () => {
  let component: ParsedResumeComponent;
  let fixture: ComponentFixture<ParsedResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParsedResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParsedResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

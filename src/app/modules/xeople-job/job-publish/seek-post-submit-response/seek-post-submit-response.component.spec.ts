import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekPostSubmitResponseComponent } from './seek-post-submit-response.component';

describe('SeekPostSubmitResponseComponent', () => {
  let component: SeekPostSubmitResponseComponent;
  let fixture: ComponentFixture<SeekPostSubmitResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeekPostSubmitResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekPostSubmitResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

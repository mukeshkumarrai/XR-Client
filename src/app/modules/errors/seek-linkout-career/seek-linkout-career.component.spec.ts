import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekLinkoutCareerComponent } from './seek-linkout-career.component';

describe('SeekLinkoutCareerComponent', () => {
  let component: SeekLinkoutCareerComponent;
  let fixture: ComponentFixture<SeekLinkoutCareerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeekLinkoutCareerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekLinkoutCareerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

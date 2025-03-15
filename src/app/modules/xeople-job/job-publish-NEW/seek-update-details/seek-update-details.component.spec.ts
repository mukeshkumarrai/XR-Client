import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekUpdateDetailsComponent } from './seek-update-details.component';

describe('SeekUpdateDetailsComponent', () => {
  let component: SeekUpdateDetailsComponent;
  let fixture: ComponentFixture<SeekUpdateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeekUpdateDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekUpdateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

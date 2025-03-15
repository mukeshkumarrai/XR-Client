import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadbeanJobBoardsStatusComponent } from './broadbean-job-boards-status.component';

describe('BroadbeanJobBoardsStatusComponent', () => {
  let component: BroadbeanJobBoardsStatusComponent;
  let fixture: ComponentFixture<BroadbeanJobBoardsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadbeanJobBoardsStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadbeanJobBoardsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

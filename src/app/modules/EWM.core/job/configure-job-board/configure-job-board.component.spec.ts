import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureJobBoardComponent } from './configure-job-board.component';

describe('ConfigureJobBoardComponent', () => {
  let component: ConfigureJobBoardComponent;
  let fixture: ComponentFixture<ConfigureJobBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureJobBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureJobBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

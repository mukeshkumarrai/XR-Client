import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatesManageComponent } from './states-manage.component';

describe('StatesManageComponent', () => {
  let component: StatesManageComponent;
  let fixture: ComponentFixture<StatesManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatesManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatesManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

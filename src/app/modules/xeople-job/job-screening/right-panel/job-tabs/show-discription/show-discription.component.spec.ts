import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDiscriptionComponent } from './show-discription.component';

describe('ShowDiscriptionComponent', () => {
  let component: ShowDiscriptionComponent;
  let fixture: ComponentFixture<ShowDiscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowDiscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDiscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

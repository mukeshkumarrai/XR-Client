import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnockoutQuesComponent } from './knockout-ques.component';

describe('KnockoutQuesComponent', () => {
  let component: KnockoutQuesComponent;
  let fixture: ComponentFixture<KnockoutQuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnockoutQuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnockoutQuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

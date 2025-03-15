import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickpeopleComponent } from './quickpeople.component';

describe('QuickpeopleComponent', () => {
  let component: QuickpeopleComponent;
  let fixture: ComponentFixture<QuickpeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickpeopleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickpeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

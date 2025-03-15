import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientVisibilityComponent } from './client-visibility.component';

describe('ClientVisibilityComponent', () => {
  let component: ClientVisibilityComponent;
  let fixture: ComponentFixture<ClientVisibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientVisibilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

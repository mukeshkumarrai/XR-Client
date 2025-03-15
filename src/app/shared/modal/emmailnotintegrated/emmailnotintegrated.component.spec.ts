import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmmailnotintegratedComponent } from './emmailnotintegrated.component';

describe('EmmailnotintegratedComponent', () => {
  let component: EmmailnotintegratedComponent;
  let fixture: ComponentFixture<EmmailnotintegratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmmailnotintegratedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmmailnotintegratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

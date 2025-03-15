import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuicklocationComponent } from './quicklocation.component';

describe('QuicklocationComponent', () => {
  let component: QuicklocationComponent;
  let fixture: ComponentFixture<QuicklocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuicklocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuicklocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
